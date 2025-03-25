import {
  FakeData,
  GetCountRequest,
  GetIsRequest,
  GetUserRequest,
  User,
  UserDto,
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
    const request: GetIsRequest = {
      token: token,
      user: user,
      selectedUser: selectedUser,
    };
    return this.serverFacade.getIsFollowerStatus(request);
  }

  public async getFolloweeCount(token: string, user: User): Promise<number> {
    const request: GetCountRequest = {
      token: token,
      user: user,
    };
    return this.serverFacade.getFolloweeCount(request);
  }

  public async getFollowerCount(token: string, user: User): Promise<number> {
    const request: GetCountRequest = {
      token: token,
      user: user,
    };
    return this.serverFacade.getFollowerCount(request);
  }

  public async unfollow(
    token: string,
    userToUnfollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the unfollow message. Remove when connected to the server
    await new Promise(f => setTimeout(f, 2000));

    const followerCount = await this.getFollowerCount(token, userToUnfollow);
    const followeeCount = await this.getFolloweeCount(token, userToUnfollow);

    return [followerCount, followeeCount];
  }

  public async getUser(token: string, alias: string): Promise<User | null> {
    const request: GetUserRequest = {
      token: token,
      alias: alias,
    };
    const response = await this.serverFacade.getUser(request);
    return User.fromDto(response ?? null);
  }

  public async follow(
    token: string,
    userToFollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the follow message. Remove when connected to the server
    await new Promise(f => setTimeout(f, 2000));

    const followerCount = await this.getFollowerCount(token, userToFollow);
    const followeeCount = await this.getFolloweeCount(token, userToFollow);

    return [followerCount, followeeCount];
  }
}
