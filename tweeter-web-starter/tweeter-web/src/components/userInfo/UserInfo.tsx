import './UserInfo.css';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useToastListener from '../toaster/ToastListenerHook';
import useUserInfo from './UseUserInfo';
import {
  UserInfoPresenter,
  UserInfoView,
} from '../../presenters/UserInfoPresenter/UserInfoPresenter';

interface Props {
  presenterGenerator: (view: UserInfoView) => UserInfoPresenter;
}

const UserInfo = (props: Props) => {
  const { displayErrorMessage, displayInfoMessage, clearLastInfoMessage } =
    useToastListener();
  const [isFollower, setIsFollower] = useState(false);
  const [followeeCount, setFolloweeCount] = useState(-1);
  const [followerCount, setFollowerCount] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser, authToken, displayedUser, setDisplayedUser } =
    useUserInfo();

  if (!displayedUser) {
    setDisplayedUser(currentUser!);
  }

  useEffect(() => {
    presenter.setIsFollowerStatus(authToken!, currentUser!, displayedUser!);
    presenter.setNumbFollowees(authToken!, displayedUser!);
    presenter.setNumbFollowers(authToken!, displayedUser!);
  }, [displayedUser]);

  const listener: UserInfoView = {
    displayErrorMessage: displayErrorMessage,
    setFolloweeCount: setFolloweeCount,
    setFollowerCount: setFollowerCount,
    setIsFollower: setIsFollower,
    setIsLoading: setIsLoading,
    displayInfoMessage: displayInfoMessage,
    clearLastInfoMessage: clearLastInfoMessage,
  };

  const [presenter] = useState(props.presenterGenerator(listener));

  const switchToLoggedInUser = (event: React.MouseEvent): void => {
    event.preventDefault();
    setDisplayedUser(currentUser!);
  };

  const followDisplayedUser = async (
    event: React.MouseEvent
  ): Promise<void> => {
    event.preventDefault();

    try {
      setIsLoading(true);
      displayInfoMessage(`Following ${displayedUser!.name}...`, 0);

      const [followerCount, followeeCount] = await presenter.userService.follow(
        authToken!.token,
        displayedUser!
      );

      setIsFollower(true);
      setFollowerCount(followerCount);
      setFolloweeCount(followeeCount);
    } catch (error) {
      displayErrorMessage(
        `Failed to follow user because of exception: ${error}`
      );
    } finally {
      clearLastInfoMessage();
      setIsLoading(false);
    }
  };

  const unfollowDisplayedUser = async (
    event: React.MouseEvent
  ): Promise<void> => {
    event.preventDefault();

    try {
      setIsLoading(true);
      displayInfoMessage(`Unfollowing ${displayedUser!.name}...`, 0);

      const [followerCount, followeeCount] =
        await presenter.userService.unfollow(authToken!.token, displayedUser!);

      setIsFollower(false);
      setFollowerCount(followerCount);
      setFolloweeCount(followeeCount);
    } catch (error) {
      displayErrorMessage(
        `Failed to unfollow user because of exception: ${error}`
      );
    } finally {
      clearLastInfoMessage();
      setIsLoading(false);
    }
  };

  return (
    <div className={isLoading ? 'loading' : ''}>
      {currentUser === null || displayedUser === null || authToken === null ? (
        <></>
      ) : (
        <div className="container">
          <div className="row">
            <div className="col-auto p-3">
              <img
                src={displayedUser.imageUrl}
                className="img-fluid"
                width="100"
                alt="Posting user"
              />
            </div>
            <div className="col p-3">
              {displayedUser !== currentUser && (
                <p id="returnToLoggedInUser">
                  Return to{' '}
                  <Link to={''} onClick={event => switchToLoggedInUser(event)}>
                    logged in user
                  </Link>
                </p>
              )}
              <h2>
                <b>{displayedUser.name}</b>
              </h2>
              <h3>{displayedUser.alias}</h3>
              <br />
              {followeeCount > -1 && followerCount > -1 && (
                <div>
                  Followees: {followeeCount} Followers: {followerCount}
                </div>
              )}
            </div>
            <form>
              {displayedUser !== currentUser && (
                <div className="form-group">
                  {isFollower ? (
                    <button
                      id="unFollowButton"
                      className="btn btn-md btn-secondary me-1"
                      type="submit"
                      style={{ width: '6em' }}
                      onClick={event => unfollowDisplayedUser(event)}
                    >
                      {isLoading ? (
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : (
                        <div>Unfollow</div>
                      )}
                    </button>
                  ) : (
                    <button
                      id="followButton"
                      className="btn btn-md btn-primary me-1"
                      type="submit"
                      style={{ width: '6em' }}
                      onClick={event => followDisplayedUser(event)}
                    >
                      {isLoading ? (
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : (
                        <div>Follow</div>
                      )}
                    </button>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfo;

// const setIsFollowerStatus = async (
//   authToken: AuthToken,
//   currentUser: User,
//   displayedUser: User
// ) => {
//   try {
//     if (currentUser === displayedUser) {
//       setIsFollower(false);
//     } else {
//       setIsFollower(
//         await presenter.getIsFollowerStatus(authToken!, currentUser!, displayedUser!)
//       );
//     }
//   } catch (error) {
//     displayErrorMessage(
//       `Failed to determine follower status because of exception: ${error}`
//     );
//   }
// };
