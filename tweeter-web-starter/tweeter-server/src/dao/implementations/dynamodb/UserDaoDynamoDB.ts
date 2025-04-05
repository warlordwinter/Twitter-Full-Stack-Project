import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { IUserDao } from '../../interfaces/IUserDao';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { UserDto } from 'tweeter-shared';

export class UserDaoDynamoDB implements IUserDao {
  private readonly dynamoClient;
  private readonly followTable: string;
  private readonly region: string = 'us-west-2';

  constructor() {
    this.dynamoClient = DynamoDBDocumentClient.from(
      new DynamoDBClient({ region: this.region })
    );
    this.followTable = 'follow';
  }
  getIsFollowerStatus(
    token: string,
    user: UserDto,
    selectedUser: UserDto
  ): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  getFolloweeCount(token: string, user: UserDto): Promise<number> {
    throw new Error('Method not implemented.');
  }
  getFollowerCount(token: string, user: UserDto): Promise<number> {
    throw new Error('Method not implemented.');
  }
  unfollow(
    token: string,
    userToUnfollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    throw new Error('Method not implemented.');
  }
  follow(
    token: string,
    userToFollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    throw new Error('Method not implemented.');
  }
  getUser(token: string, alias: string): Promise<UserDto | null> {
    throw new Error('Method not implemented.');
  }
}
