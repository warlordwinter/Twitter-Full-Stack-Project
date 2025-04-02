import './AppNavbar.css';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import Image from 'react-bootstrap/Image';
import useToastListener from '../toaster/ToastListenerHook';
import useUserInfo from '../userInfo/UseUserInfo';
import {
  AppNavbarView,
  AppNavbarPresenter,
} from '../../presenters/AuthenticationPresenters/AppNavbarPresenter';
import { SetStateAction } from 'react';

interface Props {
  presenterGenerator: (view: AppNavbarView) => AppNavbarPresenter;
}

const AppNavbar = (props: Props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { authToken, clearUserInfo, updateUserInfo } = useUserInfo();
  const { displayInfoMessage, displayErrorMessage, clearLastInfoMessage } =
    useToastListener();
  const setIsLoading: React.Dispatch<SetStateAction<boolean>> = () => {};

  const listener: AppNavbarView = {
    authToken: authToken,
    clearUserInfo: clearUserInfo,
    displayInfoMessage: displayInfoMessage,
    displayErrorMessage: displayErrorMessage,
    clearLastInfoMessage: clearLastInfoMessage,
    setIsLoading: setIsLoading,
    navigate: navigate,
    updateUserInfo: updateUserInfo,
  };

  const presenter = props.presenterGenerator(listener);

  return (
    <Navbar
      collapseOnSelect
      className="mb-4"
      expand="md"
      bg="primary"
      variant="dark"
    >
      <Container>
        <Navbar.Brand>
          <div className="d-flex flex-row">
            <div className="p-2">
              <NavLink className="brand-link" to="/">
                <Image src={'./bird-white-32.png'} alt="" />
              </NavLink>
            </div>
            <div id="brand-title" className="p-3">
              <NavLink className="brand-link" to="/">
                <b>Tweeter</b>
              </NavLink>
            </div>
          </div>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Item>
              <NavLink to="/feed">Feed</NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink to="/story">Story</NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink to="/followees">Followees</NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink to="/followers">Followers</NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink
                id="logout"
                onClick={() => presenter.logOut(authToken!)}
                to={location.pathname}
              >
                Logout
              </NavLink>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;

// const logOut = async () => {
//   displayInfoMessage("Logging Out...", 0);

//   try {
//     await logout(authToken!);

//     clearLastInfoMessage();
//     clearUserInfo();
//   } catch (error) {
//     displayErrorMessage(
//       `Failed to log user out because of exception: ${error}`
//     );
//   }
// };

// const logout = async (authToken: AuthToken): Promise<void> => {
//   // Pause so we can see the logging out message. Delete when the call to the server is implemented.
//   await new Promise((res) => setTimeout(res, 1000));
// };
