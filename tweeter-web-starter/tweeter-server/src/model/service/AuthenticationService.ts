import { Buffer } from 'buffer';
import { User, AuthToken, UserDto } from 'tweeter-shared';
import { AuthTokenDto } from 'tweeter-shared/src/model/dto/AuthTokenDto';
import { IDaoFactory } from '../../dao/interfaces/IDaoFactory';
import { IAuthDao } from '../../dao/interfaces/IAuthDao';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

export class AuthenticationService {
  private authDao: IAuthDao;

  constructor(daoFactory: IDaoFactory) {
    this.authDao = daoFactory.createAuthDao();
  }

  private generateAuthToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[User, AuthTokenDto]> {
    // Get user and password
    const [user, storedPassword] = await Promise.all([
      this.authDao.getUser(alias),
      this.authDao.getPassword(alias),
    ]);

    if (!user || !storedPassword) {
      throw new Error('Invalid alias or password');
    }

    // Verify password
    const isValid = await bcrypt.compare(password, storedPassword);
    if (!isValid) {
      throw new Error('Invalid alias or password');
    }

    // Generate and store auth token
    const token = this.generateAuthToken();
    const expiresAt = Math.floor(Date.now() / 1000) + 86400; // 24 hours
    await this.authDao.createAuthToken(token, alias, expiresAt);

    const authTokenDto: AuthTokenDto = {
      token,
      timestamp: Date.now(),
    };

    // Create User object from DTO
    const userObj = new User(
      user.firstName,
      user.lastName,
      user.alias,
      user.imageUrl
    );
    return [userObj, authTokenDto];
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[UserDto, AuthTokenDto]> {
    // Check if user already exists
    const existingUser = await this.authDao.getUser(alias);
    if (existingUser) {
      throw new Error(`User with alias "${alias}" already exists`);
    }

    // Convert image to base64
    const imageStringBase64 = Buffer.from(userImageBytes).toString('base64');
    const imageUrl = `https://${process.env.IMAGE_BUCKET_NAME}.s3.${process.env.REGION}.amazonaws.com/image/${alias}${imageFileExtension}`;

    // Create user DTO
    const userDto: UserDto = {
      firstName,
      lastName,
      alias,
      imageUrl,
    };

    // Create user and generate auth token
    await this.authDao.createUser(userDto, password);

    const token = this.generateAuthToken();
    const expiresAt = Math.floor(Date.now() / 1000) + 86400;
    await this.authDao.createAuthToken(token, alias, expiresAt);

    const authTokenDto: AuthTokenDto = {
      token,
      timestamp: Date.now(),
    };

    return [userDto, authTokenDto];
  }

  public async logout(authToken: AuthTokenDto): Promise<void> {
    await this.authDao.deleteAuthToken(authToken.token);
  }
}
