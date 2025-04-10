import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { IStatusDao } from '../../interfaces/IStatusDao';
import { StatusDto } from 'tweeter-shared';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBAuthenticator } from './DynamoDBAuthenticator';
import { IAuthenticator } from '../../interfaces/IAuthenticator';
export class StatusDaoDynamoDB implements IStatusDao {
  private readonly dynamoClient;
  private readonly region: string = 'us-west-2';
  private readonly authenticator: IAuthenticator;
  constructor() {
    this.dynamoClient = DynamoDBDocumentClient.from(
      new DynamoDBClient({ region: this.region })
    );
    this.authenticator = new DynamoDBAuthenticator();
  }

  postStatus(token: string, newStatus: StatusDto): Promise<void> {
    throw new Error('Method not implemented.');
  }
  async getFeed(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    if (!(await this.authenticator.authenticate(token))) {
      throw new Error('Invalid token');
    }
    throw new Error('Method not implemented.');
  }
  getStory(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    throw new Error('Method not implemented.');
  }
}
