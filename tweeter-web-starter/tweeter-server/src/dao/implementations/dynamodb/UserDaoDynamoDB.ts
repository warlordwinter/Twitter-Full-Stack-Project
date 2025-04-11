import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import { IUserDao } from '../../interfaces/IUserDao';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { User, UserDto } from 'tweeter-shared';
import { IAuthenticator } from '../../interfaces/IAuthenticator';
import { DynamoDBAuthenticator } from './DynamoDBAuthenticator';

export class UserDaoDynamoDB implements IUserDao {
  private readonly dynamoClient;
  private readonly followTable: string;
  private readonly userTable: string;
  private readonly region: string = 'us-west-2';
  private readonly authenticator: IAuthenticator;

  constructor() {
    this.dynamoClient = DynamoDBDocumentClient.from(
      new DynamoDBClient({ region: this.region })
    );
    this.followTable = 'follows-us-west-2';
    this.userTable = 'user';
    this.authenticator = new DynamoDBAuthenticator();
  }

  // Basic CRUD operations
  async createFollow(follower: UserDto, followee: UserDto): Promise<void> {
    await this.dynamoClient.send(
      new PutCommand({
        TableName: this.followTable,
        Item: {
          follower_handle: follower.alias,
          followee_handle: followee.alias,
          follower_name: follower.firstName + ' ' + follower.lastName,
          followee_name: followee.firstName + ' ' + followee.lastName,
        },
      })
    );
  }

  async deleteFollow(follower: UserDto, followee: UserDto): Promise<void> {
    await this.dynamoClient.send(
      new DeleteCommand({
        TableName: this.followTable,
        Key: {
          follower_handle: follower.alias,
          followee_handle: followee.alias,
        },
      })
    );
  }

  async getFollow(follower: UserDto, followee: UserDto): Promise<boolean> {
    const result = await this.dynamoClient.send(
      new GetCommand({
        TableName: this.followTable,
        Key: {
          follower_handle: follower.alias,
          followee_handle: followee.alias,
        },
      })
    );
    return result.Item !== undefined;
  }

  async updateFollowerCount(user: UserDto, increment: number): Promise<void> {
    await this.dynamoClient.send(
      new UpdateCommand({
        TableName: this.userTable,
        Key: { alias: user.alias },
        UpdateExpression:
          'SET follower_count = if_not_exists(follower_count, :zero) + :inc',
        ExpressionAttributeValues: {
          ':zero': 0,
          ':inc': increment,
        },
      })
    );
  }

  async updateFolloweeCount(user: UserDto, increment: number): Promise<void> {
    await this.dynamoClient.send(
      new UpdateCommand({
        TableName: this.userTable,
        Key: { alias: user.alias },
        UpdateExpression:
          'SET followee_count = if_not_exists(followee_count, :zero) + :inc',
        ExpressionAttributeValues: {
          ':zero': 0,
          ':inc': increment,
        },
      })
    );
  }

  async getFollowerCount(user: UserDto): Promise<number> {
    const result = await this.dynamoClient.send(
      new GetCommand({
        TableName: this.userTable,
        Key: { alias: user.alias },
        ProjectionExpression: 'follower_count',
      })
    );
    return result.Item?.follower_count || 0;
  }

  async getFolloweeCount(user: UserDto): Promise<number> {
    const result = await this.dynamoClient.send(
      new GetCommand({
        TableName: this.userTable,
        Key: { alias: user.alias },
        ProjectionExpression: 'followee_count',
      })
    );
    return result.Item?.followee_count || 0;
  }

  async getUser(alias: string): Promise<User | null> {
    const result = await this.dynamoClient.send(
      new GetCommand({
        TableName: this.userTable,
        Key: { alias },
      })
    );
    return result.Item as User | null;
  }
}
