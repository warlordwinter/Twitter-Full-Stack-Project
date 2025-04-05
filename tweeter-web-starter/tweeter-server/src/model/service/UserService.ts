import { User, UserDto } from 'tweeter-shared';
import { IDaoFactory } from '../../dao/interfaces/IDaoFactory';
import { IUserDao } from '../../dao/interfaces/IUserDao';

export class UserService {
  private followDao: IUserDao;

  constructor(daoFactory: IDaoFactory) {
    this.followDao = daoFactory.createUserDao();
  }

  public async getIsFollowerStatus(
    token: string,
    userDto: UserDto,
    selectedUser: UserDto
  ): Promise<boolean> {
    const user = User.fromDto(userDto);
    if (user === null) {
      throw new Error('Invalid alias or password');
    }
    return this.followDao.getIsFollowerStatus(token, user, selectedUser);
  }

  public async getFolloweeCount(token: string, user: UserDto): Promise<number> {
    return this.followDao.getFolloweeCount(token, user);
  }

  public async getFollowerCount(token: string, user: UserDto): Promise<number> {
    return this.followDao.getFollowerCount(token, user);
  }

  public async unfollow(
    token: string,
    userToUnfollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the unfollow message. Remove when connected to the server
    await new Promise(f => setTimeout(f, 2000));

    const followerCount = await this.followDao.getFollowerCount(
      token,
      userToUnfollow
    );
    const followeeCount = await this.followDao.getFolloweeCount(
      token,
      userToUnfollow
    );

    return [followerCount, followeeCount];
  }

  public async getUser(token: string, alias: string): Promise<UserDto | null> {
    return this.followDao.getUser(token, alias);
  }

  public async follow(
    token: string,
    userToFollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the follow message. Remove when connected to the server
    await new Promise(f => setTimeout(f, 2000));

    const followerCount = await this.followDao.getFollowerCount(
      token,
      userToFollow
    );
    const followeeCount = await this.followDao.getFolloweeCount(
      token,
      userToFollow
    );

    return [followerCount, followeeCount];
  }
}
