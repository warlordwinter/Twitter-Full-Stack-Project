import { AuthToken, Status } from 'tweeter-shared';
import {
  PAGE_SIZE,
  StatusItemPresenter,
  StatusItemView,
} from './StatusItemPresenter';

export class StoryPresenter extends StatusItemPresenter {
  protected getMoreItems(
    authToken: AuthToken,
    userAlias: string
  ): Promise<[Status[], boolean]> {
    return this.service.loadMoreStory(
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
