import { User } from "tweeter-shared";
import { Link } from "react-router-dom";
import { UserInfoContext } from "../userInfo/UserInfoProvider";
import { useContext } from "react";
import useToastListener from "../toaster/ToastListenerHook";
import useNavigationListener from "../navigationHook/NavigationListenerHook";

interface Props {
  value: User;
}

const UserItem = (props: Props) => {
  const { displayErrorMessage } = useToastListener();
  const { navigateToUser } = useNavigationListener();
  const { setDisplayedUser, currentUser, authToken } =
    useContext(UserInfoContext);

  // this is dup code jijk;kfjl;aklj;s;lkjfsdlkj;sdfalkj;fdaslkj;asfdlkj;fasdlkj;sdfalkj;asdlk;jlkj;alkj;afsdlkjfsdal;jkasdflkj;fdsalkj;asdfklj;adfs;lkjsadf;l

  return (
    <div className="col bg-light mx-0 px-0">
      <div className="container px-0">
        <div className="row mx-0 px-0">
          <div className="col-auto p-3">
            <img
              src={props.value.imageUrl}
              className="img-fluid"
              width="80"
              alt="Posting user"
            />
          </div>
          <div className="col">
            <h2>
              <b>
                {props.value.firstName} {props.value.lastName}
              </b>{" "}
              -{" "}
              <Link
                to={props.value.alias}
                onClick={(event) => navigateToUser(event)}
              >
                {props.value.alias}
              </Link>
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserItem;
