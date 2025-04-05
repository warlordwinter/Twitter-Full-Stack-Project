import { FakeData, User } from 'tweeter-shared';
import { ServerFacade } from '../net/ServerFacade';

export class FollowService {
  private serverFacade: ServerFacade;

  public constructor() {
    this.serverFacade = new ServerFacade();
  }

  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    const request = {
      token: token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem?.dto ?? null,
    };
    return this.serverFacade.getMoreFollowers(request);
  }

  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    const request = {
      token: token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem?.dto ?? null,
    };

    return await this.serverFacade.getMoreFollowees(request);
  }

  // private async getFakeData(
  //   lastItem: User | null,
  //   pageSize: number,
  //   userAlias: string
  // ): Promise<[User[], boolean]> {
  //   const [items, hasMore] = FakeData.instance.getPageOfUsers(
  //     User.fromDto(lastItem),
  //     pageSize,
  //     userAlias
  //   );
  //   return [items, hasMore];
  // }
}
