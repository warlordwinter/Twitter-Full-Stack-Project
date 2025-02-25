import { AuthParentPresenter } from './AuthParentPresenter';
import { AuthView } from './AuthPresenter';

export interface LoginView extends AuthView {}
export class LoginPresenter extends AuthParentPresenter<AuthView> {
  public async doLogin(
    alias: string,
    password: string,
    rememberMe: boolean,
    props: { originalUrl?: string }
  ): Promise<void> {
    await this.authOperation(
      () => this._service.login(alias, password),
      rememberMe,
      props.originalUrl
    );
  }

  getItemDescription(): string {
    return 'log in user';
  }
}
