import { User } from 'tweeter-shared';
import { View } from '../Presenter';
import { PagedItemPresenter } from '../PagedItemPresenter';
import { FollowService } from '../../model/service/FollowService';
//4:46 duplication and generics
export const PAGE_SIZE = 10;

export interface UserItemView extends View {
  addItems: (newItems: User[]) => void;
}

export abstract class UserItemPresenter extends PagedItemPresenter<
  User,
  FollowService
> {
  public constructor(view: UserItemView) {
    super(view);
  }
  protected createService(): FollowService {
    return new FollowService();
  }
}
