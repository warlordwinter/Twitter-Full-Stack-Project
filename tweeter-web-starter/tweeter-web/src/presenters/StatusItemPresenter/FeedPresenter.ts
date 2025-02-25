import { AuthToken } from 'tweeter-shared';
import { StatusService } from '../../model/service/StatusService';
import { StatusItemPresenter, StatusItemView } from './StatusItemPresenter';

export const PAGE_SIZE = 10;

export class FeedPresenter extends StatusItemPresenter {
  private statusService: StatusService;

  public constructor(view: StatusItemView) {
    super(view);
    this.statusService = new StatusService();
  }

  public async loadMoreFeedStory(authToken: AuthToken, userAlias: string) {
    this.doFailureReportingOperation(async () => {
      const [newItems, hasMore] = await this.statusService.loadMoreFeed(
        authToken,
        userAlias,
        PAGE_SIZE,
        this.lastItem
      );

      this.hasMoreItems = hasMore;
      this.lastItem = newItems[newItems.length - 1];
      this.view.addItems(newItems);
    }, 'load more feed stories');
  }
}
