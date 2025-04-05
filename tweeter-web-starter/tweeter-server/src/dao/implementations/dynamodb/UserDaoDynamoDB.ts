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
          follower_alias: user.alias,
          followee_alias: selectedUser.alias,
        },
      })
    );
    return result.Item !== undefined;
  }
  async getFolloweeCount(token: string, user: UserDto): Promise<number> {
    if (!(await this.authenticate(token))) {
      throw new Error('Invalid token');
    }
    console.log('user in getFolloweeCount', user);

    const result = await this.dynamoClient.send(
      new QueryCommand({
        TableName: this.followTable,
        KeyConditionExpression: 'follower_alias = :follower',
        ExpressionAttributeValues: {
          ':follower': user.alias,
        },
        Select: 'COUNT',
      })
    );
    return result.Count ?? 0;
  }
  async getFollowerCount(token: string, user: UserDto): Promise<number> {
    if (!(await this.authenticate(token))) {
      throw new Error('Invalid token');
    }

    const result = await this.dynamoClient.send(
      new QueryCommand({
        TableName: this.followTable,
        IndexName: 'followee_alias-index', // You'll need to create this index
        KeyConditionExpression: 'followee_alias = :followee',
        ExpressionAttributeValues: {
          ':followee': user.alias,
        },
        Select: 'COUNT',
      })
    );
    return result.Count ?? 0;
  }

  async unfollow(
    token: string,
    userToUnfollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    if (!(await this.authenticate(token))) {
      throw new Error('Invalid token');
    }
    const user = await this.getUser(token, userToUnfollow.alias);
    console.log('user in unfollow', user);
    if (!user) {
      throw new Error('User not found in unfollow action');
    }

    const result = await this.dynamoClient.send(
      new GetCommand({
        TableName: this.followTable,
        Key: {
          follower_alias: user.alias,
          followee_alias: userToUnfollow.alias,
        },
      })
    );
    if (result.Item) {
      await this.dynamoClient.send(
        new UpdateCommand({
          TableName: this.followTable,
          Key: {
            follower_alias: user.alias,
            followee_alias: userToUnfollow.alias, // TODO: Check if this is correct
          },
          UpdateExpression: 'SET followee_count = followee_count - :dec',
          ExpressionAttributeValues: {
            ':dec': 1,
          },
        })
      );
    }
    const followerCount = await this.getFollowerCount(token, user);
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
    const result = await this.dynamoClient.send(
      new GetCommand({
        TableName: this.followTable,
        Key: {
          follower_alias: user.alias,
          followee_alias: userToFollow.alias, // TODO: Check if this is correct
        },
      })
    );
    if (result.Item) {
      throw new Error('User already followed');
    }
    await this.dynamoClient.send(
      new UpdateCommand({
        TableName: this.followTable,
        Key: {
          follower_alias: user.alias,
          followee_alias: userToFollow.alias,
        },
        UpdateExpression: 'SET followee_count = followee_count + :inc',
        ExpressionAttributeValues: {
          ':inc': 1,
        },
      })
    );
    const followerCount = await this.getFollowerCount(token, user);
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
