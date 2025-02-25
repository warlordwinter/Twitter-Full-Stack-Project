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

  public logOut = async () => {
    this.view.displayInfoMessage('Logging Out...', 0);
    this.tryCatchFinallyReportingOperation(async () => {
      await this._service.logout(this.view.authToken!);
      this.view.clearLastInfoMessage();
      this.view.clearUserInfo();
    }, 'log user out');
  };
}
