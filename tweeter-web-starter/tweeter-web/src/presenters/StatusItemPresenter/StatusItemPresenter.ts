import { Status } from 'tweeter-shared';
import { View } from '../Presenter';
import { PagedItemPresenter } from '../PagedItemPresenter';
import { StatusService } from '../../model/service/StatusService';
export const PAGE_SIZE = 10;

//4:46 duplication and generics
//29:49
export interface StatusItemView extends View {
  addItems: (newItems: Status[]) => void;
}

export abstract class StatusItemPresenter extends PagedItemPresenter<
  Status,
  StatusService
> {
  public constructor(view: StatusItemView) {
    super(view);
  }
  protected createService(): StatusService {
    return new StatusService();
  }
}
