import { User } from 'tweeter-shared';
import { View } from '../Presenter';
import { PagedItemPresenter } from '../PagedItemPresenter';
//4:46 duplication and generics

export interface UserItemView extends View {
  addItems: (newItems: User[]) => void;
}

export abstract class UserItemPresenter extends PagedItemPresenter<
  User,
  UserItemView
> {
  protected constructor(view: UserItemView) {
    super(view);
  }
}
