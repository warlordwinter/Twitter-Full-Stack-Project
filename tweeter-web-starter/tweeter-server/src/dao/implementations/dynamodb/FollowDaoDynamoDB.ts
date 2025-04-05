import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { IFollowDao } from '../../interfaces/IFollowDao';
import { UserDto } from 'tweeter-shared';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
export class FollowDaoDynamoDB implements IFollowDao {
  private readonly dynamoClient;
  private readonly region: string = 'us-west-2';
  constructor() {
    this.dynamoClient = DynamoDBDocumentClient.from(
      new DynamoDBClient({ region: this.region })
    );
  }

  getFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    throw new Error('Method not implemented.');
  }
  getFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    throw new Error('Method not implemented.');
  }
}
