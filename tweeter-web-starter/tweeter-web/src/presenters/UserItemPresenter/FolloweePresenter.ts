import { AuthToken, User } from 'tweeter-shared';
import { PAGE_SIZE, UserItemPresenter } from './UserItemPresenter';

export class FolloweePresenter extends UserItemPresenter {
  protected async getMoreItems(
    authToken: AuthToken,
    userAlias: string
  ): Promise<[User[], boolean]> {
    return await this.service.loadMoreFollowees(
      authToken.token,
      userAlias,
      PAGE_SIZE,
      this.lastItem
    );
  }

  protected getItemDescription(): string {
    return 'load followees';
  }
}
