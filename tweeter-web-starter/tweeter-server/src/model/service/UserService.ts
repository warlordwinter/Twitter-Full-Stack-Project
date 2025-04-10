import { User, UserDto } from 'tweeter-shared';
import { IDaoFactory } from '../../dao/interfaces/IDaoFactory';
import { IUserDao } from '../../dao/interfaces/IUserDao';
import { IAuthenticator } from '../../dao/interfaces/IAuthenticator';
import { DynamoDBAuthenticator } from '../../dao/implementations/dynamodb/DynamoDBAuthenticator';

export class UserService {
  private userDao: IUserDao;
  private authenticator: IAuthenticator;

  constructor(daoFactory: IDaoFactory) {
    this.userDao = daoFactory.createUserDao();
    this.authenticator = new DynamoDBAuthenticator();
  }

  public async getIsFollowerStatus(
    token: string,
    user: UserDto,
    selectedUser: UserDto
  ): Promise<boolean> {
    // await this.authenticator.authenticate(token);
    console.log('token in getIsFollowerStatus', token);
    return this.userDao.getFollow(user, selectedUser);
  }

  public async getFolloweeCount(token: string, user: UserDto): Promise<number> {
    // await this.authenticator.authenticate(token);
    console.log('token in getFolloweeCount', token);
    return this.userDao.getFolloweeCount(user);
  }

  public async getFollowerCount(token: string, user: UserDto): Promise<number> {
    // await this.authenticator.authenticate(token);
    console.log('token in getFollowerCount', token);
    return this.userDao.getFollowerCount(user);
  }

  public async unfollow(
    token: string,
    userToUnfollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    const followerAlias = await this.authenticator.lookup(token);
    const follower = await this.userDao.getUser(followerAlias);
    if (!follower) {
      throw new Error('Follower not found');
    }

    await this.userDao.deleteFollow(follower, userToUnfollow);
    await this.userDao.updateFollowerCount(userToUnfollow, -1);
    await this.userDao.updateFolloweeCount(follower, -1);

    const followerCount = await this.userDao.getFollowerCount(userToUnfollow);
    const followeeCount = await this.userDao.getFolloweeCount(follower);
    return [followerCount, followeeCount];
  }

  public async follow(
    token: string,
    userToFollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    const followerAlias = await this.authenticator.lookup(token);
    const follower = await this.userDao.getUser(followerAlias);
    if (!follower) {
      throw new Error('Follower not found');
    }

    await this.userDao.createFollow(follower, userToFollow);
    await this.userDao.updateFollowerCount(userToFollow, 1);
    await this.userDao.updateFolloweeCount(follower, 1);

    const followerCount = await this.userDao.getFollowerCount(userToFollow);
    const followeeCount = await this.userDao.getFolloweeCount(follower);
    return [followerCount, followeeCount];
  }

  public async getUser(token: string, alias: string): Promise<UserDto | null> {
    await this.authenticator.authenticate(token);
    return this.userDao.getUser(alias);
  }
}
