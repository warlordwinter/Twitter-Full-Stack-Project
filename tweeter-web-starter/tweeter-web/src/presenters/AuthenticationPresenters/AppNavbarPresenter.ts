import { AuthToken } from 'tweeter-shared';
import { AuthParentPresenter } from './AuthParentPresenter';
import { AuthView } from './AuthPresenter';

export interface AppNavbarView extends AuthView {
  authToken: AuthToken | null;
  clearUserInfo: () => void;
  displayInfoMessage: (
    message: string,
    duration: number,
    bootstrapClasses?: string
  ) => void;
  clearLastInfoMessage: () => void;
}
export class AppNavbarPresenter extends AuthParentPresenter<AppNavbarView> {
  protected getItemDescription(): string {
    return 'log user out';
  }

  public logOut = async (authToken: AuthToken) => {
    this.view.displayInfoMessage('Logging Out...', 0);
    await this.tryCatchFinallyReportingOperation(async () => {
      await this._service.logout(authToken);
      this.view.clearLastInfoMessage();
      this.view.clearUserInfo();
      this.view.navigate('/login');
    }, 'log user out');
  };
}
