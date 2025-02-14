import { AuthToken, User } from 'tweeter-shared';
import { UserService } from '../../model/service/UserService';

export interface NavigationView {
  extractAlias: (value: string) => string;
  getUser: (authToken: AuthToken, alias: string) => Promise<User | null>;
  setDisplayedUser: (user: User) => void;
  displayErrorMessage: (message: string, bootstrapClasses?: string) => void;
  currentUser: User | null;
  authToken: AuthToken | null;
}

export class NavigationPresenter {
  public view: NavigationView;
  public userService: UserService;

  constructor(view: NavigationView) {
    this.view = view;
    this.userService = new UserService();
  }

  public async navigateToUser(event: React.MouseEvent): Promise<void> {
    event.preventDefault();

    try {
      const alias = this.view.extractAlias(event.target.toString());

      const user = await this.userService.getUser(this.view.authToken!, alias);

      if (!!user) {
        if (this.view.currentUser!.equals(user)) {
          this.view.setDisplayedUser(this.view.currentUser!);
        } else {
          this.view.setDisplayedUser(user);
        }
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get user because of exception: ${error}`
      );
    }
  }
  public extractAlias = (value: string): string => {
    const index = value.indexOf('@');
    return value.substring(index);
  };
  public getUser = async (
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> => {
    return await this.userService.getUser(authToken, alias);
  };
}
