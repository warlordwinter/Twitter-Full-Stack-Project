import { AuthToken, User } from 'tweeter-shared';
import { AuthenticationService } from '../../model/service/AuthenticationService';
import { AuthPresenter, AuthView } from './AuthPresenter';

// export interface AuthParentView extends AuthView {}

export abstract class AuthParentPresenter<
  T extends AuthView
> extends AuthPresenter<T> {
  protected _service: AuthenticationService;

  public constructor(view: T) {
    super(view);
    this._service = new AuthenticationService();
  }

  protected async authOperation(
    operation: () => Promise<[User, AuthToken]>,
    rememberMe: boolean,
    originalUrl?: string
  ) {
    try {
      this.view.setIsLoading(true);

      const [user, authToken] = await operation();

      this.view.updateUserInfo(user, user, authToken, rememberMe);

      if (originalUrl) {
        this.view.navigate(originalUrl);
      } else {
        this.view.navigate('/');
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to ${this.getItemDescription()} because of exception: ${error}`
      );
    } finally {
      this.view.setIsLoading(false);
    }
  }

  protected get service() {
    return this._service;
  }

  protected abstract getItemDescription(): string;
}
