import { AuthToken } from 'tweeter-shared';
import { AuthenticationService } from '../../model/service/AuthenticationService';
import { AuthView, Presenter } from '../Presenter';

export interface AppNavbarView extends AuthView {
  clearUserInfo: () => void;
  displayInfoMessage: (
    message: string,
    duration: number,
    bootstrapClasses?: string
  ) => void;
  clearLastInfoMessage: () => void;
  authToken: AuthToken | null;
}
export class AppNavbarPresenter extends Presenter<AppNavbarView> {
  public authService: AuthenticationService;

  constructor(view: AppNavbarView) {
    super(view);
    this.authService = new AuthenticationService();
  }

  public logOut = async () => {
    this.view.displayInfoMessage('Logging Out...', 0);
    this.doFailureReportingOperation(async () => {
      await this.authService.logout(this.view.authToken!);
      this.view.clearLastInfoMessage();
      this.view.clearUserInfo();
    }, 'log user out');
  };
}
