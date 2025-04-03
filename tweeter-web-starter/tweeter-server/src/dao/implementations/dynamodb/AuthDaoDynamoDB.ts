import { AuthTokenDto, User, UserDto } from 'tweeter-shared';
import { IAuthDao } from '../../interfaces/IAuthDao';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from '@aws-sdk/lib-dynamodb';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

export class AuthDaoDynamoDB implements IAuthDao {
  private readonly client;
  private readonly authTokenTable: string;
  private readonly userTable: string;
  private readonly saltRounds: number = 10;

  constructor() {
    const dbClient = new DynamoDBClient({ region: 'us-west-2' });
    this.client = DynamoDBDocumentClient.from(dbClient);
    this.authTokenTable = 'authtoken';
    this.userTable = 'user';
  }

  private generateAuthToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageStringBase64: string,
    imageFileExtension: string
  ): Promise<[UserDto, AuthTokenDto]> {
    // Check if user already exists
    const getCommand = new GetCommand({
      TableName: this.userTable,
      Key: { alias },
    });

    const existingUser = await this.client.send(getCommand);
    if (existingUser.Item) {
      throw new Error(`User with alias "${alias}" already exists`);
    }

    const hashedPassword = await bcrypt.hash(password, this.saltRounds);

    const putUserCommand = new PutCommand({
      TableName: this.userTable,
      Item: {
        alias,
        firstName,
        lastName,
        password: hashedPassword,
        image: imageStringBase64,
        imageFileExtension,
        createdAt: Date.now(),
      },
    });

    await this.client.send(putUserCommand);
    const user = new User(firstName, lastName, alias, imageStringBase64);

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
        expiresAt,
      },
    });

    await this.client.send(putAuthTokenCommand);

    return [user.dto, authTokenDto];
  }

  async logout(authToken: AuthTokenDto): Promise<void> {
    throw new Error('Method not implemented.');
  }
  async login(
    alias: string,
    password: string
  ): Promise<[UserDto, AuthTokenDto]> {
    throw new Error('Method not implemented.');
  }
}
