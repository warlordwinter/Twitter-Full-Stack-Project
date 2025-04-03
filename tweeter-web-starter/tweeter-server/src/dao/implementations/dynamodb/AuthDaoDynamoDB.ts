import { AuthTokenDto, UserDto } from 'tweeter-shared';
import { IAuthDao } from '../../interfaces/IAuthDao';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import crypto from 'crypto';

export class AuthDaoDynamoDB implements IAuthDao {
  private readonly client: DynamoDBClient;
  private readonly authTokenTable: string;

  constructor() {
    this.client = new DynamoDBClient({ region: 'us-west-2' });
    this.authTokenTable = 'tweeter-api-authtoken';
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
    throw new Error('Method not implemented.');
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
