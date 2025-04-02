import { AuthToken } from 'tweeter-shared';
import { PAGE_SIZE, StatusItemPresenter } from './StatusItemPresenter';

export class FeedPresenter extends StatusItemPresenter {
  protected async getMoreItems(authToken: AuthToken, userAlias: string) {
    return await this.service.loadMoreFeed(
      authToken.token,
      userAlias,
      PAGE_SIZE,
      this.lastItem
    );
  }

  protected getItemDescription(): string {
    return 'load more feed stories';
  }
}
