import './PostStatus.css';
import { useState } from 'react';
import useToastListener from '../toaster/ToastListenerHook';
import useUserInfo from '../userInfo/UseUserInfo';
import {
  PostStatusPresenter,
  PostStatusView,
} from '../../presenters/PostStatusPresentersFolder/PostStatusPresenter';

interface Props {
  presenterGenerator: (view: PostStatusView) => PostStatusPresenter;
}

const PostStatus = (props: Props) => {
  const { displayErrorMessage, displayInfoMessage, clearLastInfoMessage } =
    useToastListener();
  const { currentUser, authToken } = useUserInfo();
  const [post, setPost] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const listener: PostStatusView = {
    setIsLoading: setIsLoading,
    displayErrorMessage: displayErrorMessage,
    displayInfoMessage: displayInfoMessage,
    clearLastInfoMessage: clearLastInfoMessage,
    setPost: setPost,
    post: post,
    authToken: authToken,
    currentUser: currentUser,
  };
  const presenter = props.presenterGenerator(listener);

  return (
    <div className={isLoading ? 'loading' : ''}>
      <form>
        <div className="form-group mb-3">
          <textarea
            className="form-control"
            id="postStatusTextArea"
            aria-label="textarea"
            rows={10}
            placeholder="What's on your mind?"
            value={post}
            onChange={event => {
              setPost(event.target.value);
            }}
          />
        </div>
        <div className="form-group">
          <button
            id="postStatusButton"
            aria-label="PostStatusButton"
            className="btn btn-md btn-primary me-1"
            type="button"
            disabled={presenter.checkButtonStatus()}
            style={{ width: '8em' }}
            onClick={event => presenter.submitPost(event)}
          >
            {isLoading ? (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
            ) : (
              <div>Post Status</div>
            )}
          </button>
          <button
            id="clearStatusButton"
            className="btn btn-md btn-secondary"
            aria-label="ClearStatusButton"
            type="button"
            disabled={presenter.checkButtonStatus()}
            onClick={event => presenter.clearPost(event)}
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostStatus;

// const submitPost = async (event: React.MouseEvent) => {
//   event.preventDefault();

//   try {
//     setIsLoading(true);
//     displayInfoMessage('Posting status...', 0);

//     const status = new Status(post, currentUser!, Date.now());

//     await postStatus(authToken!, status);

//     setPost('');
//     displayInfoMessage('Status posted!', 2000);
//   } catch (error) {
//     displayErrorMessage(
//       `Failed to post the status because of exception: ${error}`
//     );
//   } finally {
//     clearLastInfoMessage();
//     setIsLoading(false);
//   }
// };

// const clearPost = (event: React.MouseEvent) => {
//   event.preventDefault();
//   setPost('');
// };

// const checkButtonStatus: () => boolean = () => {
//   return !post.trim() || !authToken || !currentUser;
// };
