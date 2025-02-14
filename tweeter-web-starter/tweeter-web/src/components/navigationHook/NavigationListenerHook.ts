import { AuthToken, User } from 'tweeter-shared';
import useToastListener from '../toaster/ToastListenerHook';
import useUserInfo from '../userInfo/UseUserInfo';
import {
  NavigationPresenter,
  NavigationView,
} from '../../presenters/NavigationPresenter/NavigationPresenter';

interface NavigationListener {
  navigateToUser: (event: React.MouseEvent) => Promise<void>;
  extractAlias: (value: string) => string;
  getUser: (authToken: AuthToken, alias: string) => Promise<User | null>;
}

const useNavigationListener = (): NavigationListener => {
  const { displayErrorMessage } = useToastListener();
  const { setDisplayedUser, currentUser, authToken } = useUserInfo();

  const view: NavigationView = {
    extractAlias: (value: string) => {
      const index = value.indexOf('@');
      return value.substring(index);
    },
    getUser: async (authToken: AuthToken, alias: string) => {
      return await new NavigationPresenter(view).userService.getUser(
        authToken,
        alias
      );
    },
    setDisplayedUser: (user: User) => {
      setDisplayedUser(user);
    },
    displayErrorMessage: (message: string, bootstrapClasses?: string) => {
      displayErrorMessage(message, bootstrapClasses);
    },
    currentUser: currentUser,
    authToken: authToken,
  };

  const presenter = new NavigationPresenter(view);

  return {
    navigateToUser: presenter.navigateToUser,
    extractAlias: presenter.extractAlias,
    getUser: presenter.getUser,
  };
};
export default useNavigationListener;

// const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
//   event.preventDefault();

//   try {
//     const alias = extractAlias(event.target.toString());

//     const user = await getUser(authToken!, alias);

//     if (!!user) {
//       if (currentUser!.equals(user)) {
//         setDisplayedUser(currentUser!);
//       } else {
//         setDisplayedUser(user);
//       }
//     }
//   } catch (error) {
//     displayErrorMessage(`Failed to get user because of exception: ${error}`);
//   }
// };
// const extractAlias = (value: string): string => {
//   const index = value.indexOf("@");
//   return value.substring(index);
// };
