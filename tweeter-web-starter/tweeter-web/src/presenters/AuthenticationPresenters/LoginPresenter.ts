import { AuthenticationService } from '../../model/service/AuthenticationService';
import { AuthView } from './AuthPresenter';

export interface LoginView extends AuthView {}
export class LoginPresenter {
  public view: LoginView;
  public loginService: AuthenticationService;

  constructor(view: LoginView) {
    this.view = view;
    this.loginService = new AuthenticationService();
  }

  public async doLogin(
    alias: string,
    password: string,
    rememberMe: boolean,
    props: { originalUrl?: string }
  ): Promise<void> {
    try {
      this.view.setIsLoading(true);

      const [user, authToken] = await this.loginService.login(alias, password);

      this.view.updateUserInfo(user, user, authToken, rememberMe);

      if (!!props.originalUrl) {
        this.view.navigate(props.originalUrl);
      } else {
        this.view.navigate('/');
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user in because of exception: ${error}`
      );
    } finally {
      this.view.setIsLoading(false);
    }
  }
}
