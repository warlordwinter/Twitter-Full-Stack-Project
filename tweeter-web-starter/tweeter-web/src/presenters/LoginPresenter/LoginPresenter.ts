import { NavigateFunction } from 'react-router-dom';
import { LoginService } from '../../model/service/LoginService';
import { AuthToken } from 'tweeter-shared/dist/model/domain/AuthToken';
import { User } from 'tweeter-shared';

export interface LoginView {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  displayErrorMessage: (message: string) => void;
  navigate: NavigateFunction;
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ) => void;
}

export class LoginPresenter {
  public view: LoginView;
  public loginService: LoginService;

  constructor(view: LoginView) {
    this.view = view;
    this.loginService = new LoginService();
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
