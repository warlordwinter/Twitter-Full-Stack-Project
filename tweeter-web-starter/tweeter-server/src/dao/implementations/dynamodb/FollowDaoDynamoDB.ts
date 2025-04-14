import {
  DynamoDBDocumentClient,
  QueryCommand,
  QueryCommandInput,
  ScanCommand,
  ScanCommandInput,
} from '@aws-sdk/lib-dynamodb';
import { IFollowDao } from '../../interfaces/IFollowDao';
import { UserDto } from 'tweeter-shared';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { IUserDao } from '../../interfaces/IUserDao';
import { UserDaoDynamoDB } from './UserDaoDynamoDB';

export class FollowDaoDynamoDB implements IFollowDao {
  private readonly dynamoClient;
  private readonly region: string = 'us-west-2';
  private readonly tableName = 'follows-us-west-2-v1';
  readonly userTableName = 'user';
  readonly followerAliasAttr = 'follower_handle';
  readonly followeeAliasAttr = 'followee_handle';
  private readonly userDao: IUserDao;

  constructor() {
    this.dynamoClient = DynamoDBDocumentClient.from(
      new DynamoDBClient({ region: this.region })
    );
    this.userDao = new UserDaoDynamoDB();
  }

  async getFollowers(
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    const params: QueryCommandInput = {
      TableName: this.tableName,
      IndexName: 'follows_index',
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

    // Get complete user information for each follower
    const followers = await Promise.all(
      result.Items?.map(async item => {
        const followerAlias = item[this.followerAliasAttr];
        const user = await this.userDao.getUser(followerAlias);
        if (!user) {
          throw new Error(`User not found: ${followerAlias}`);
        }
        return user;
      }) || []
    );

    const hasMore = !!result.LastEvaluatedKey;
    return [followers, hasMore];
  }

  async getFollowees(
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    const params: QueryCommandInput = {
      TableName: this.tableName,
      KeyConditionExpression: `${this.followerAliasAttr} = :follower`,
      ExpressionAttributeValues: {
        ':follower': userAlias,
      },
      Limit: pageSize,
      ScanIndexForward: true,
    };

    if (lastItem) {
      params.ExclusiveStartKey = {
        [this.followerAliasAttr]: userAlias,
        [this.followeeAliasAttr]: lastItem.alias,
      };
    }

    const result = await this.dynamoClient.send(new QueryCommand(params));

    // Get complete user information for each followee
    const followees = await Promise.all(
      result.Items?.map(async item => {
        const followeeAlias = item[this.followeeAliasAttr];
        const user = await this.userDao.getUser(followeeAlias);
        if (!user) {
          throw new Error(`User not found: ${followeeAlias}`);
        }
        return user;
      }) || []
    );

    const hasMore = !!result.LastEvaluatedKey;
    return [followees, hasMore];
  }

  async getAllUsers(alias: string): Promise<[UserDto[]]> {
    const params: ScanCommandInput = {
      TableName: this.userTableName,
      FilterExpression: 'alias <> :alias',
      ExpressionAttributeValues: {
        ':alias': alias,
      },
    };

    const result = await this.dynamoClient.send(new ScanCommand(params));

    const users =
      result.Items?.map(
        item =>
          ({
            firstName: item.firstName,
            lastName: item.lastName,
            alias: item.alias,
            imageUrl: item.imageUrl,
          } as UserDto)
      ) || [];

    return [users];
  }
}
