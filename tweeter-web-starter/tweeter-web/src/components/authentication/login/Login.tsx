import './Login.css';
import 'bootstrap/dist/css/bootstrap.css';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthenticationFormLayout from '../AuthenticationFormLayout';
import useToastListener from '../../toaster/ToastListenerHook';
import AuthenticationFields from '../AuthenticationFields';
import useUserInfo from '../../userInfo/UseUserInfo';
import {
  LoginView,
  LoginPresenter,
} from '../../../presenters/AuthenticationPresenters/LoginPresenter';
//post status and logout
interface Props {
  presenterGenerator?: (view: LoginView) => LoginPresenter;
  originalUrl?: string;
}

const Login = (props: Props) => {
  const [alias, setAlias] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfo();
  const { displayErrorMessage } = useToastListener();

  const checkSubmitButtonStatus = (): boolean => {
    return !alias || !password;
  };

  const listener: LoginView = {
    setIsLoading: setIsLoading,
    displayErrorMessage: displayErrorMessage,
    navigate: navigate,
    updateUserInfo: updateUserInfo,
  };
  const [presenter] = useState(props.presenterGenerator!(listener));

  const loginOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key == 'Enter' && !checkSubmitButtonStatus()) {
      presenter.doLogin(alias, password, rememberMe, {
        originalUrl: props.originalUrl,
      });
    }
  };

  const inputFieldGenerator = () => {
    return (
      <>
        <AuthenticationFields
          passedInFunction={loginOnEnter}
          setAlias={setAlias}
          setPassword={setPassword}
          alias={alias}
          password={password}
        />
      </>
    );
  };

  const switchAuthenticationMethodGenerator = () => {
    return (
      <div className="mb-3">
        Not registered? <Link to="/register">Register</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldGenerator={inputFieldGenerator}
      switchAuthenticationMethodGenerator={switchAuthenticationMethodGenerator}
      setRememberMe={setRememberMe}
      submitButtonDisabled={checkSubmitButtonStatus}
      isLoading={isLoading}
      submit={() =>
        presenter.doLogin(alias, password, rememberMe, {
          originalUrl: props.originalUrl,
        })
      }
    />
  );
};

export default Login;

// const doLogin = async () => {
//   try {
//     setIsLoading(true);

//     const [user, authToken] = await login(alias, password);

//     updateUserInfo(user, user, authToken, rememberMe);

//     if (!!props.originalUrl) {
//       navigate(props.originalUrl);
//     } else {
//       navigate('/');
//     }
//   } catch (error) {
//     displayErrorMessage(
//       `Failed to log user in because of exception: ${error}`
//     );
//   } finally {
//     setIsLoading(false);
//   }
// };
