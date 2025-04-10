import { FakeData, User } from 'tweeter-shared';
import { UserDto } from 'tweeter-shared/src/model/dto/UserDto';
import { IDaoFactory } from '../../dao/interfaces/IDaoFactory';
import { IFollowDao } from '../../dao/interfaces/IFollowDao';

export class FollowService {
  private followDao: IFollowDao;

  public constructor(daoFactory: IDaoFactory) {
    this.followDao = daoFactory.createFollowDao();
  }

  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    // TODO: Replace with the result of calling server
    return this.followDao.getFollowers(token, userAlias, pageSize, lastItem);
  }

  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    // TODO: Replace with the result of calling server
    return this.followDao.getFollowees(token, userAlias, pageSize, lastItem);
  }
}
