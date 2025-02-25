import { Status } from 'tweeter-shared';
import { View } from '../Presenter';
import { PagedItemPresenter } from '../PagedItemPresenter';
//4:46 duplication and generics
//29:49
export interface StatusItemView extends View {
  addItems: (newItems: Status[]) => void;
}

export abstract class StatusItemPresenter extends PagedItemPresenter<
  Status,
  StatusItemView
> {
  protected constructor(view: StatusItemView) {
    super(view);
  }
}
