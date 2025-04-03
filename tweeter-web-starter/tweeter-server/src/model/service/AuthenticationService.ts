import { Buffer } from 'buffer';
import { User, AuthToken } from 'tweeter-shared';
import { AuthTokenDto } from 'tweeter-shared/src/model/dto/AuthTokenDto';
import { IDaoFactory } from '../../dao/interfaces/IDaoFactory';
import { IAuthDao } from '../../dao/interfaces/IAuthDao';

export class AuthenticationService {
  private authDao: IAuthDao;

  constructor(daoFactory: IDaoFactory) {
    this.authDao = daoFactory.createAuthDao();
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[User, AuthTokenDto]> {
    const [userDto, authTokenDto] = await this.authDao.login(alias, password);
    const user = User.fromDto(userDto);
    if (user === null) {
      throw new Error('Invalid alias or password');
    }
    return [user, authTokenDto];
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[User, AuthTokenDto]> {
    const imageStringBase64: string =
      Buffer.from(userImageBytes).toString('base64');
    const [userDto, authTokenDto] = await this.authDao.register(
      firstName,
      lastName,
      alias,
      password,
      imageStringBase64,
      imageFileExtension
    );
    const user = User.fromDto(userDto);
    if (user === null) {
      throw new Error('Invalid registration');
    }
    return [user, authTokenDto];
  }

  public async logout(authToken: AuthTokenDto): Promise<void> {
    await this.authDao.logout(authToken);
  }
}
