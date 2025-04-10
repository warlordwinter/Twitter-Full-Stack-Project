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

  async getIsFollowerStatus(
    token: string,
    user: UserDto,
    selectedUser: UserDto
  ): Promise<boolean> {
    if (!(await this.authenticator.authenticate(token))) {
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
    console.log('token in getFolloweeCount', token);
    try {
      const result = await this.dynamoClient.send(
        new GetCommand({
          TableName: this.followTable,
          Key: {
            follower_handle: user.alias,
            followee_handle: user.alias,
          },
          ProjectionExpression: 'followee_count',
        })
      );

      return result.Item?.followee_count || 0;
    } catch (error) {
      console.error('Error getting followee count:', error);
      return 0;
    }
  }

  async getFollowerCount(token: string, user: UserDto): Promise<number> {
    console.log('token in getFollowerCount', token);

    try {
      const result = await this.dynamoClient.send(
        new GetCommand({
          TableName: this.followTable,
          Key: {
            follower_handle: user.alias,
            followee_handle: user.alias,
          },
          ProjectionExpression: 'follower_count',
        })
      );

      return result.Item?.follower_count || 0;
    } catch (error) {
      console.error('Error getting follower count:', error);
      return 0;
    }
  }
  //
  async unfollow(
    token: string,
    userToUnfollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    if (!(await this.authenticator.authenticate(token))) {
      throw new Error('Invalid token');
    }

    const user = await this.getUser(token, userToUnfollow.alias);
    if (!user) {
      throw new Error('User not found in unfollow action');
    }

    // Delete the follow relationship
    await this.dynamoClient.send(
      new DeleteCommand({
        TableName: this.followTable,
        Key: {
          follower_handle: user.alias,
          followee_handle: userToUnfollow.alias,
        },
      })
    );

    // Decrement follower count for the followee
    await this.dynamoClient.send(
      new UpdateCommand({
        TableName: this.followTable,
        Key: {
          follower_handle: userToUnfollow.alias,
          followee_handle: userToUnfollow.alias,
        },
        UpdateExpression:
          'SET follower_count = if_not_exists(follower_count, :zero) - :dec',
        ExpressionAttributeValues: {
          ':zero': 0,
          ':dec': 1,
        },
      })
    );

    // Decrement followee count for the follower
    await this.dynamoClient.send(
      new UpdateCommand({
        TableName: this.followTable,
        Key: {
          follower_handle: user.alias,
          followee_handle: user.alias,
        },
        UpdateExpression:
          'SET followee_count = if_not_exists(followee_count, :zero) - :dec',
        ExpressionAttributeValues: {
          ':zero': 0,
          ':dec': 1,
        },
      })
    );

    // Get the updated counts
    const followerCount = await this.getFollowerCount(token, userToUnfollow);
    const followeeCount = await this.getFolloweeCount(token, user);

    return [followerCount, followeeCount];
  }

  async follow(
    token: string,
    userToFollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    if (!(await this.authenticator.authenticate(token))) {
      throw new Error('Invalid token');
    }

    const user = await this.getUser(token, userToFollow.alias);
    if (!user) {
      throw new Error('User not found in follow action');
    }

    // Initialize counts if they don't exist
    await this.dynamoClient.send(
      new UpdateCommand({
        TableName: this.followTable,
        Key: {
          follower_handle: userToFollow.alias,
          followee_handle: userToFollow.alias,
        },
        UpdateExpression:
          'SET follower_count = if_not_exists(follower_count, :zero)',
        ExpressionAttributeValues: {
          ':zero': 0,
        },
      })
    );

    await this.dynamoClient.send(
      new UpdateCommand({
        TableName: this.followTable,
        Key: {
          follower_handle: user.alias,
          followee_handle: user.alias,
        },
        UpdateExpression:
          'SET followee_count = if_not_exists(followee_count, :zero)',
        ExpressionAttributeValues: {
          ':zero': 0,
        },
      })
    );

    // Create the follow relationship
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

    // Increment follower count for the followee
    await this.dynamoClient.send(
      new UpdateCommand({
        TableName: this.followTable,
        Key: {
          follower_handle: userToFollow.alias,
          followee_handle: userToFollow.alias,
        },
        UpdateExpression: 'SET follower_count = follower_count + :inc',
        ExpressionAttributeValues: {
          ':inc': 1,
        },
      })
    );

    // Increment followee count for the follower
    await this.dynamoClient.send(
      new UpdateCommand({
        TableName: this.followTable,
        Key: {
          follower_handle: user.alias,
          followee_handle: user.alias,
        },
        UpdateExpression: 'SET followee_count = followee_count + :inc',
        ExpressionAttributeValues: {
          ':inc': 1,
        },
      })
    );

    // Get the updated counts
    const followerCount = await this.getFollowerCount(token, userToFollow);
    const followeeCount = await this.getFolloweeCount(token, user);

    return [followerCount, followeeCount];
  }

  async getUser(token: string, alias: string): Promise<User | null> {
    if (!(await this.authenticator.authenticate(token))) {
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
