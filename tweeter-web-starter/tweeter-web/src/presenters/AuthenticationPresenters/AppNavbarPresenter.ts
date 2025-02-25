import { AuthToken } from 'tweeter-shared';
import { AuthenticationService } from '../../model/service/AuthenticationService';
import { AuthView } from './AuthPresenter';

// export interface AppNavbarView {
//   displayErrorMessage: (message: string, bootstrapClasses?: string) => void;
//   clearUserInfo: () => void;
//   displayInfoMessage: (
//     message: string,
//     duration: number,
//     bootstrapClasses?: string
//   ) => void;
//   clearLastInfoMessage: () => void;
//   authToken: AuthToken | null;
// }

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
export class AppNavbarPresenter {
  public view: AppNavbarView;
  public authService: AuthenticationService;

  constructor(view: AppNavbarView) {
    this.view = view;
    this.authService = new AuthenticationService();
  }

  public logOut = async () => {
    this.view.displayInfoMessage('Logging Out...', 0);

    try {
      await this.authService.logout(this.view.authToken!);

      this.view.clearLastInfoMessage();
      this.view.clearUserInfo();
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user out because of exception: ${error}`
      );
    }
  };
}
