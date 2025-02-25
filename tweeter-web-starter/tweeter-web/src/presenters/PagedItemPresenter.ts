import { AuthToken } from 'tweeter-shared';
import { Presenter, View } from './Presenter';

export abstract class PagedItemPresenter<
  T,
  V extends View
> extends Presenter<V> {
  private _hasMoreItems: boolean = true;
  private _lastItem: T | null = null;

  protected constructor(view: V) {
    super(view);
  }

  public get hasMoreItems() {
    return this._hasMoreItems;
  }

  protected set hasMoreItems(value: boolean) {
    this._hasMoreItems = value;
  }

  protected get lastItem(): T | null {
    return this._lastItem;
  }

  protected set lastItem(value: T | null) {
    this._lastItem = value;
  }

  reset() {
    this.lastItem = null;
    this._hasMoreItems = true;
  }

  public abstract loadMoreItems(authToken: AuthToken, userAlias: string): void;
}
