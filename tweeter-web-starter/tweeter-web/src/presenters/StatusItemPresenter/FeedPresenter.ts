import { AuthToken } from 'tweeter-shared';
import { PAGE_SIZE, StatusItemPresenter } from './StatusItemPresenter';

export class FeedPresenter extends StatusItemPresenter {
  protected getMoreItems(authToken: AuthToken, userAlias: string) {
    return this.service.loadMoreFeed(
      authToken,
      userAlias,
      PAGE_SIZE,
      this.lastItem
    );
  }

  protected getItemDescription(): string {
    return 'load more feed stories';
  }
}
