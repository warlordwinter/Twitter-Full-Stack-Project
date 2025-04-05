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

export class UserDaoDynamoDB implements IUserDao {
  private readonly dynamoClient;
  private readonly followTable: string;
  private readonly userTable: string;
  private readonly authTable: string;
  private readonly region: string = 'us-west-2';

  constructor() {
    this.dynamoClient = DynamoDBDocumentClient.from(
      new DynamoDBClient({ region: this.region })
    );
    this.followTable = 'follow';
    this.userTable = 'user';
    this.authTable = 'authtoken';
  }

  async authenticate(token: string): Promise<boolean> {
    const result = await this.dynamoClient.send(
      new GetCommand({
        TableName: this.authTable,
        Key: { token },
      })
    );
    return result.Item !== undefined;
  }

  async getIsFollowerStatus(
    token: string,
    user: UserDto,
    selectedUser: UserDto
  ): Promise<boolean> {
    if (!(await this.authenticate(token))) {
      throw new Error('Invalid token');
    }
    const result = await this.dynamoClient.send(
      new GetCommand({
        TableName: this.followTable,
        Key: {
          follower_handle: user.alias,
          followee_handle: selectedUser.alias,
        },
      })
    );
    return result.Item !== undefined;
  }

  async getFolloweeCount(token: string, user: UserDto): Promise<number> {
    if (!(await this.authenticate(token))) {
      throw new Error('Invalid token');
    }

    try {
      const result = await this.dynamoClient.send(
        new QueryCommand({
          TableName: this.followTable,
          KeyConditionExpression: 'follower_handle = :follower',
          ExpressionAttributeValues: {
            ':follower': user.alias,
          },
          Select: 'COUNT',
        })
      );
      return result.Count || 0;
    } catch (error) {
      console.error('Error getting followee count:', error);
      return 0;
    }
  }

  async getFollowerCount(token: string, user: UserDto): Promise<number> {
    if (!(await this.authenticate(token))) {
      throw new Error('Invalid token');
    }

    try {
      const result = await this.dynamoClient.send(
        new QueryCommand({
          TableName: this.followTable,
          IndexName: 'follows_index',
          KeyConditionExpression: 'followee_handle = :followee',
          ExpressionAttributeValues: {
            ':followee': user.alias,
          },
          Select: 'COUNT',
        })
      );
      return result.Count || 0;
    } catch (error) {
      console.error('Error getting follower count:', error);
      return 0;
    }
  }

  async unfollow(
    token: string,
    userToUnfollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    if (!(await this.authenticate(token))) {
      throw new Error('Invalid token');
    }

    const user = await this.getUser(token, userToUnfollow.alias);
    if (!user) {
      throw new Error('User not found in unfollow action');
    }

    await this.dynamoClient.send(
      new DeleteCommand({
        TableName: this.followTable,
        Key: {
          follower_handle: user.alias,
          followee_handle: userToUnfollow.alias,
        },
      })
    );

    const followerCount = await this.getFollowerCount(token, userToUnfollow);
    const followeeCount = await this.getFolloweeCount(token, user);

    return [followerCount, followeeCount];
  }

  async follow(
    token: string,
    userToFollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    if (!(await this.authenticate(token))) {
      throw new Error('Invalid token');
    }

    const user = await this.getUser(token, userToFollow.alias);
    if (!user) {
      throw new Error('User not found in follow action');
    }

    await this.dynamoClient.send(
      new PutCommand({
        TableName: this.followTable,
        Item: {
          follower_handle: user.alias,
          followee_handle: userToFollow.alias,
          follower_name: user.firstName + ' ' + user.lastName,
          followee_name: userToFollow.firstName + ' ' + userToFollow.lastName,
        },
      })
    );

    const followerCount = await this.getFollowerCount(token, userToFollow);
    const followeeCount = await this.getFolloweeCount(token, user);

    return [followerCount, followeeCount];
  }

  async getUser(token: string, alias: string): Promise<User | null> {
    if (!(await this.authenticate(token))) {
      throw new Error('Invalid token');
    }
    console.log('alias in getUser', alias);
    const result = await this.dynamoClient.send(
      new GetCommand({
        TableName: this.userTable,
        Key: { alias },
      })
    );
    return result.Item as User | null;
  }
}
