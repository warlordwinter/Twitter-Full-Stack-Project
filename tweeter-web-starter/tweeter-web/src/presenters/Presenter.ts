import { NavigateFunction } from 'react-router-dom';
import { User, AuthToken } from 'tweeter-shared';

export interface View {
  displayErrorMessage: (message: string) => void;
}
export interface AuthView extends View {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  navigate: NavigateFunction;
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ) => void;
}
export class Presenter<T extends View> {
  private _view: T;

  protected constructor(view: T) {
    this._view = view;
  }

  protected get view() {
    return this._view;
  }

  protected async doFailureReportingOperation(
    operation: () => Promise<void>,
    operationDescription: string
  ) {
    try {
      operation();
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to ${operationDescription} because of exception: ${error}`
      );
    }
  }

  // protected async tryCatchFinallyReportingOperation(
  //   operation: () => Promise<void>,
  //   operationDescription: string
  // ) {
  //   try {
  //     operation();
  //   } catch (error) {
  //     this.view.displayErrorMessage(
  //       `Failed to ${operationDescription} because of exception: ${error}`
  //     );
  //   } finally {
  //     this.view.setIsLoading(false);
  // }
}
