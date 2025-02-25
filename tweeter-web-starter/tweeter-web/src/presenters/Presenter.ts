export interface View {
  displayErrorMessage: (message: string) => void;
}

export class Presenter<T extends View> {
  private _view: T;

  protected constructor(view: T) {
    this._view = view;
  }

  protected get view() {
    return this._view;
  }
}
