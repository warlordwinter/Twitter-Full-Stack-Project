import { NavigateFunction } from 'react-router-dom';
import { User, AuthToken } from 'tweeter-shared';
import { Presenter, View } from '../Presenter';

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

export class AuthPresenter<V extends AuthView> extends Presenter<V> {
  protected constructor(view: V) {
    super(view);
  }

  protected async tryCatchFinallyReportingOperation(
    operation: () => Promise<void>,
    operationDescription: string
  ) {
    try {
      operation();
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to ${operationDescription} because of exception: ${error}`
      );
    } finally {
      this.view.setIsLoading(false);
    }
  }
}
