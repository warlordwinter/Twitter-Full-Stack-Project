import './App.css';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import Login from './components/authentication/login/Login';
import Register from './components/authentication/register/Register';
import MainLayout from './components/mainLayout/MainLayout';
import Toaster from './components/toaster/Toaster';
import UserItemScroller from './components/mainLayout/UserItemScroller';
import StatusItemScroller from './components/mainLayout/StatusItemScroller';
import useUserInfo from './components/userInfo/UseUserInfo';
import { FeedPresenter } from './presenters/StatusItemPresenter/FeedPresenter';
import { StatusItemView } from './presenters/StatusItemPresenter/StatusItemPresenter';
import { StoryPresenter } from './presenters/StatusItemPresenter/StoryPresenter';
import { FolloweePresenter } from './presenters/UserItemPresenter/FolloweePresenter';
import { FollowerPresenter } from './presenters/UserItemPresenter/FollowerPresenter';
import { UserItemView } from './presenters/UserItemPresenter/UserItemPresenter';
import {
  LoginPresenter,
  LoginView,
} from './presenters/AuthenticationPresenters/LoginPresenter';
import {
  RegisterView,
  RegisterPresenter,
} from './presenters/AuthenticationPresenters/RegisterPresenter';

const App = () => {
  const { currentUser, authToken } = useUserInfo();

  const isAuthenticated = (): boolean => {
    return !!currentUser && !!authToken;
  };

  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        {isAuthenticated() ? (
          <AuthenticatedRoutes />
        ) : (
          <UnauthenticatedRoutes />
        )}
      </BrowserRouter>
    </div>
  );
};

const AuthenticatedRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to="/feed" />} />
        <Route
          path="feed"
          element={
            <StatusItemScroller
              key={1}
              presenterGenerator={(view: StatusItemView) =>
                new FeedPresenter(view)
              }
            />
          }
        />
        <Route
          path="story"
          element={
            <StatusItemScroller
              key={2}
              presenterGenerator={(view: StatusItemView) =>
                new StoryPresenter(view)
              }
            />
          }
        />
        <Route
          path="followees"
          element={
            <UserItemScroller
              key={1}
              presenterGenerator={(view: UserItemView) =>
                new FolloweePresenter(view)
              }
            />
          }
        />
        <Route
          path="followers"
          element={
            <UserItemScroller
              key={2}
              presenterGenerator={(view: UserItemView) =>
                new FollowerPresenter(view)
              }
            />
          }
        />
        <Route path="logout" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/feed" />} />
      </Route>
    </Routes>
  );
};

const UnauthenticatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <Login
            presenterGenerator={(view: LoginView) => new LoginPresenter(view)}
          />
        }
      />
      <Route
        path="/register"
        element={
          <Register
            presenterGenerator={(view: RegisterView) =>
              new RegisterPresenter(view)
            }
          />
        }
      />
      <Route
        path="*"
        element={
          <Login
            presenterGenerator={(view: LoginView) => new LoginPresenter(view)}
            originalUrl={location.pathname}
          />
        }
      />
    </Routes>
  );
};

export default App;
