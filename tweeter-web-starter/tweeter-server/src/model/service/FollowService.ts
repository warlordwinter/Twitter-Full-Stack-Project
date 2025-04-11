import { UserDto } from 'tweeter-shared';
import { IDaoFactory } from '../../dao/interfaces/IDaoFactory';
import { IFollowDao } from '../../dao/interfaces/IFollowDao';
import { IAuthenticator } from '../../dao/interfaces/IAuthenticator';
import { DynamoDBAuthenticator } from '../../dao/implementations/dynamodb/DynamoDBAuthenticator';
import { IUserDao } from '../../dao/interfaces/IUserDao';
export class FollowService {
  private followDao: IFollowDao;
  private userDao: IUserDao;
  private authenticator: IAuthenticator;

  public constructor(daoFactory: IDaoFactory) {
    this.followDao = daoFactory.createFollowDao();
    this.userDao = daoFactory.createUserDao();
    this.authenticator = new DynamoDBAuthenticator();
  }

  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    if (!(await this.authenticator.authenticate(token))) {
      throw new Error('Invalid token');
    }

    const user = await this.userDao.getUser(userAlias);
    if (user === null) {
      throw new Error('User not found');
    }

    if ((await this.userDao.getFollowerCount(user)) === 0) {
      const [users] = await this.followDao.getAllUsers();
      return [users, false];
    } else {
      return this.followDao.getFollowers(userAlias, pageSize, lastItem);
    }
  }

  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    if (!(await this.authenticator.authenticate(token))) {
      throw new Error('Invalid token');
    }
    const user = await this.userDao.getUser(userAlias);
    if (user === null) {
      throw new Error('User not found');
    }
    if ((await this.userDao.getFolloweeCount(user)) === 0) {
      const [users] = await this.followDao.getAllUsers();
      return [users, false];
    } else {
      return this.followDao.getFollowees(userAlias, pageSize, lastItem);
    }
  }
}
