import { AuthTokenDto, UserDto } from 'tweeter-shared';
import { IAuthDao } from '../../interfaces/IAuthDao';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

export class AuthDaoDynamoDB implements IAuthDao {
  private readonly client = new DynamoDBClient({ region: 'us-west-2' });

  constructor() {
    this.client = new DynamoDBClient({ region: 'us-west-2' });
    this.authTokenTable = 'tweeter-api-authtoken';
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
