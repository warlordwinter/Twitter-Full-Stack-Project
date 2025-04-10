import {
  DynamoDBDocumentClient,
  QueryCommand,
  QueryCommandInput,
} from '@aws-sdk/lib-dynamodb';
import { IFollowDao } from '../../interfaces/IFollowDao';
import { UserDto } from 'tweeter-shared';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { IAuthenticator } from '../../interfaces/IAuthenticator';
import { DynamoDBAuthenticator } from './DynamoDBAuthenticator';

export class FollowDaoDynamoDB implements IFollowDao {
  private readonly dynamoClient;
  private readonly region: string = 'us-west-2';
  readonly tableName = 'follow';
  readonly followerAliasAttr = 'follower_alias';
  readonly followeeAliasAttr = 'followee_alias';
  private readonly authenticator: IAuthenticator;

  constructor() {
    this.dynamoClient = DynamoDBDocumentClient.from(
      new DynamoDBClient({ region: this.region })
    );
    this.authenticator = new DynamoDBAuthenticator();
  }

  async getFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    if (!(await this.authenticator.authenticate(token))) {
      throw new Error('Invalid token');
    }

    const params: QueryCommandInput = {
      TableName: this.tableName,
      IndexName: 'followee_alias-index',
      KeyConditionExpression: `${this.followeeAliasAttr} = :followee`,
      ExpressionAttributeValues: {
        ':followee': userAlias,
      },
      Limit: pageSize,
      ScanIndexForward: true,
    };

    if (lastItem) {
      params.ExclusiveStartKey = {
        [this.followeeAliasAttr]: userAlias,
        [this.followerAliasAttr]: lastItem.alias,
      };
    }

    const result = await this.dynamoClient.send(new QueryCommand(params));

    const followers =
      result.Items?.map(item => {
        const followerAlias = item[this.followerAliasAttr];
        // For now, we'll create a basic UserDto with just the alias
        // You might want to join with the users table to get full user details
        return {
          firstName: '',
          lastName: '',
          alias: followerAlias,
          imageUrl: '',
        } as UserDto;
      }) || [];

    const hasMore = !!result.LastEvaluatedKey;
    return [followers, hasMore];
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
