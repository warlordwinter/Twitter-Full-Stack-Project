import { AuthToken, Status } from 'tweeter-shared';
import { View, Presenter } from '../Presenter';
//4:46 duplication and generics

export interface StatusItemView extends View {
  addItems: (newItems: Status[]) => void;
}

export abstract class StatusItemPresenter extends Presenter<StatusItemView> {
  private _hasMoreItems = true;
  private _lastItem: Status | null = null;

  protected constructor(view: StatusItemView) {
    super(view);
  }

  public get hasMoreItems() {
    return this._hasMoreItems;
  }

  protected set hasMoreItems(value: boolean) {
    this._hasMoreItems = value;
  }

  protected get lastItem() {
    return this._lastItem;
  }

  protected set lastItem(value: Status | null) {
    this._lastItem = value;
  }
  reset() {
    this.lastItem = null;
    this._hasMoreItems = true;
  }

  public abstract loadMoreFeedStory(
    authToken: AuthToken,
    userAlias: string
  ): void;
}
