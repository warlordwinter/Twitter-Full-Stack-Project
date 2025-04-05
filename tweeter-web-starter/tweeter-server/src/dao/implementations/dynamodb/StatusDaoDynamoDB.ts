import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { IStatusDao } from '../../interfaces/IStatusDao';
import { StatusDto } from 'tweeter-shared';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
export class StatusDaoDynamoDB implements IStatusDao {
  private readonly dynamoClient;
  private readonly region: string = 'us-west-2';

  constructor() {
    this.dynamoClient = DynamoDBDocumentClient.from(
      new DynamoDBClient({ region: this.region })
    );
  }

  postStatus(token: string, newStatus: StatusDto): Promise<void> {
    throw new Error('Method not implemented.');
  }
  getFeed(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
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
