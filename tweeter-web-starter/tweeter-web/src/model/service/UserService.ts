import {
  FollowRequest,
  GetCountRequest,
  GetIsRequest,
  GetUserRequest,
  UnfollowRequest,
  User,
} from 'tweeter-shared';
import { ServerFacade } from '../net/ServerFacade';
export class UserService {
  private serverFacade: ServerFacade;

  public constructor() {
    this.serverFacade = new ServerFacade();
  }

  public async getIsFollowerStatus(
    token: string,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    try {
      console.log('Constructing request with:', {
        token,
        user: user.dto,
        selectedUser: selectedUser.dto,
      });

      const request: GetIsRequest = {
        token: token,
        user: user.dto,
        selectedUser: selectedUser.dto,
      };

      const response = await this.serverFacade.getIsFollowerStatus(request);
      console.log('Received response:', response);
      return response;
    } catch (error) {
      console.error('Error in getIsFollowerStatus:', error);
      throw error;
    }
  }

  public async getFolloweeCount(token: string, user: User): Promise<number> {
    const request: GetCountRequest = {
      token: token,
      user: user.dto,
    };
    return this.serverFacade.getFolloweeCount(request);
  }

  public async getFollowerCount(token: string, user: User): Promise<number> {
    const request: GetCountRequest = {
      token: token,
      user: user.dto,
    };
    return this.serverFacade.getFollowerCount(request);
  }

  public async unfollow(
    token: string,
    userToUnfollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    const request: UnfollowRequest = {
      token: token,
      userToUnfollow: userToUnfollow.dto,
    };
    await this.serverFacade.unfollow(request);

    const followerCount = await this.getFollowerCount(token, userToUnfollow);
    const followeeCount = await this.getFolloweeCount(token, userToUnfollow);

    return [followerCount, followeeCount];
  }

  public async getUser(token: string, alias: string): Promise<User | null> {
    // Clean up the alias by removing any URL parts and @ symbol
    const cleanAlias = alias.replace(/^.*\//, '').replace(/^@/, '');

    const request: GetUserRequest = {
      token: token,
      alias: cleanAlias,
    };
    const response = await this.serverFacade.getUser(request);
    return User.fromDto(response ?? null);
  }

  public async follow(
    token: string,
    userToFollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    try {
      const request: FollowRequest = {
        token: token,
        userToFollow: userToFollow.dto,
      };
      await this.serverFacade.follow(request);

      // If follow was successful, get the updated counts
      const followerCount = await this.getFollowerCount(token, userToFollow);
      const followeeCount = await this.getFolloweeCount(token, userToFollow);

      return [followerCount, followeeCount];
    } catch (error) {
      console.error('Error in follow operation:', error);
      // If the error is due to invalid JSON, retry once
      if (
        error instanceof Error &&
        error.message.includes('invalid response')
      ) {
        console.log('Retrying follow operation...');
        return this.follow(token, userToFollow);
      }
      throw error;
    }
  }
}
