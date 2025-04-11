import { AuthTokenDto, User, UserDto } from 'tweeter-shared';
import { IAuthDao } from '../../interfaces/IAuthDao';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  DeleteCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export class AuthDaoDynamoDB implements IAuthDao {
  private readonly dynamoClient;
  private readonly s3Client;
  private readonly authTokenTable: string;
  private readonly userTable: string;
  private readonly saltRounds: number = 10;
  private readonly bucketName: string;
  private readonly region: string = 'us-west-2';

  constructor() {
    this.dynamoClient = DynamoDBDocumentClient.from(
      new DynamoDBClient({ region: this.region })
    );
    this.s3Client = new S3Client({ region: this.region });
    this.authTokenTable = 'authtoken';
    this.userTable = 'user';
    this.bucketName = 'wiley-tweeter-image-storage';
  }

  private generateAuthToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  private async putImage(
    fileName: string,
    imageStringBase64Encoded: string
  ): Promise<string> {
    let decodedImageBuffer: Buffer = Buffer.from(
      imageStringBase64Encoded,
      'base64'
    );
    const s3Params = {
      Bucket: this.bucketName,
      Key: 'image/' + fileName,
      Body: decodedImageBuffer,
      ContentType: 'image/png',
    };
    const c = new PutObjectCommand(s3Params);
    try {
      await this.s3Client.send(c);
      return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/image/${fileName}`;
    } catch (error) {
      throw Error('s3 put image failed with: ' + error);
    }
  }

  async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageStringBase64: string,
    imageFileExtension: string
  ): Promise<[UserDto, AuthTokenDto]> {
    const getCommand = new GetCommand({
      TableName: this.userTable,
      Key: { alias },
    });

    const existingUser = await this.dynamoClient.send(getCommand);
    if (existingUser.Item) {
      throw new Error(`User with alias "${alias}" already exists`);
    }

    const hashedPassword = await bcrypt.hash(password, this.saltRounds);
    const imageUrl = await this.putImage(
      `${alias}${imageFileExtension}`,
      imageStringBase64
    );

    const putUserCommand = new PutCommand({
      TableName: this.userTable,
      Item: {
        alias,
        firstName,
        lastName,
        password: hashedPassword,
        imageUrl,
        createdAt: Date.now(),
      },
    });

    await this.dynamoClient.send(putUserCommand);
    const user = new User(firstName, lastName, alias, imageUrl);

    const authToken = this.generateAuthToken();
    const expiresAt = Math.floor(Date.now() / 1000) + 86400;

    const authTokenDto: AuthTokenDto = {
      token: authToken,
      timestamp: Date.now(),
    };

    const putAuthTokenCommand = new PutCommand({
      TableName: this.authTokenTable,
      Item: {
        token: authToken,
        alias: alias,
        expiresAt,
      },
    });

    await this.dynamoClient.send(putAuthTokenCommand);

    return [user.dto, authTokenDto];
  }

  async logout(authToken: AuthTokenDto): Promise<void> {
    await this.dynamoClient.send(
      new DeleteCommand({
        TableName: this.authTokenTable,
        Key: { token: authToken.token },
      })
    );
  }

  async login(
    alias: string,
    password: string
  ): Promise<[UserDto, AuthTokenDto]> {
    const getCommand = new GetCommand({
      TableName: this.userTable,
      Key: { alias },
    });

    const result = await this.dynamoClient.send(getCommand);
    if (!result.Item) {
      throw new Error('Invalid alias or password');
    }

    const isValid = await bcrypt.compare(password, result.Item.password);
    if (!isValid) {
      throw new Error('Invalid alias or password');
    }

    const userDto: UserDto = {
      firstName: result.Item.firstName,
      lastName: result.Item.lastName,
      alias: result.Item.alias,
      imageUrl: result.Item.imageUrl,
    };

    const authToken = this.generateAuthToken();
    const expiresAt = Math.floor(Date.now() / 1000) + 86400;

    const putAuthTokenCommand = new PutCommand({
      TableName: this.authTokenTable,
      Item: {
        token: authToken,
        alias: alias,
        expiresAt,
      },
    });

    await this.dynamoClient.send(putAuthTokenCommand);

    const authTokenDto: AuthTokenDto = {
      token: authToken,
      timestamp: Date.now(),
    };

    return [userDto, authTokenDto];
  }

  // User CRUD operations
  async getUser(alias: string): Promise<UserDto | null> {
    const getCommand = new GetCommand({
      TableName: this.userTable,
      Key: { alias },
    });

    const result = await this.dynamoClient.send(getCommand);
    if (!result.Item) {
      return null;
    }

    return {
      firstName: result.Item.firstName,
      lastName: result.Item.lastName,
      alias: result.Item.alias,
      imageUrl: result.Item.imageUrl,
    };
  }

  async createUser(user: UserDto, password: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(password, this.saltRounds);

    const putCommand = new PutCommand({
      TableName: this.userTable,
      Item: {
        alias: user.alias,
        firstName: user.firstName,
        lastName: user.lastName,
        password: hashedPassword,
        imageUrl: user.imageUrl,
        createdAt: Date.now(),
      },
    });

    await this.dynamoClient.send(putCommand);
  }

  async updateUser(user: UserDto): Promise<void> {
    const updateCommand = new UpdateCommand({
      TableName: this.userTable,
      Key: { alias: user.alias },
      UpdateExpression:
        'SET firstName = :firstName, lastName = :lastName, imageUrl = :imageUrl',
      ExpressionAttributeValues: {
        ':firstName': user.firstName,
        ':lastName': user.lastName,
        ':imageUrl': user.imageUrl,
      },
    });

    await this.dynamoClient.send(updateCommand);
  }

  async deleteUser(alias: string): Promise<void> {
    const deleteCommand = new DeleteCommand({
      TableName: this.userTable,
      Key: { alias },
    });

    await this.dynamoClient.send(deleteCommand);
  }

  // AuthToken CRUD operations
  async createAuthToken(
    token: string,
    alias: string,
    expiresAt: number
  ): Promise<void> {
    const putCommand = new PutCommand({
      TableName: this.authTokenTable,
      Item: {
        token,
        alias,
        expiresAt,
      },
    });

    await this.dynamoClient.send(putCommand);
  }

  async getAuthToken(
    token: string
  ): Promise<{ alias: string; expiresAt: number } | null> {
    const getCommand = new GetCommand({
      TableName: this.authTokenTable,
      Key: { token },
    });

    const result = await this.dynamoClient.send(getCommand);
    if (!result.Item) {
      return null;
    }

    return {
      alias: result.Item.alias,
      expiresAt: result.Item.expiresAt,
    };
  }

  async deleteAuthToken(token: string): Promise<void> {
    const deleteCommand = new DeleteCommand({
      TableName: this.authTokenTable,
      Key: { token },
    });

    await this.dynamoClient.send(deleteCommand);
  }

  // Password operations
  async getPassword(alias: string): Promise<string | null> {
    const getCommand = new GetCommand({
      TableName: this.userTable,
      Key: { alias },
      ProjectionExpression: 'password',
    });

    const result = await this.dynamoClient.send(getCommand);
    return result.Item?.password || null;
  }

  async updatePassword(alias: string, newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, this.saltRounds);

    const updateCommand = new UpdateCommand({
      TableName: this.userTable,
      Key: { alias },
      UpdateExpression: 'SET password = :password',
      ExpressionAttributeValues: {
        ':password': hashedPassword,
      },
    });

    await this.dynamoClient.send(updateCommand);
  }
}
