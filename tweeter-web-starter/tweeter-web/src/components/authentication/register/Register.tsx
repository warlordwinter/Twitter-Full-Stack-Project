import './Register.css';
import 'bootstrap/dist/css/bootstrap.css';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthenticationFormLayout from '../AuthenticationFormLayout';
import useToastListener from '../../toaster/ToastListenerHook';
import AuthenticationFields from '../AuthenticationFields';
import useUserInfo from '../../userInfo/UseUserInfo';
import {
  RegisterView,
  RegisterPresenter,
} from '../../../presenters/AuthenticationPresenters/RegisterPresenter';

interface Props {
  presenterGenerator: (view: RegisterView) => RegisterPresenter;
}

const Register = (props: Props) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [alias, setAlias] = useState('');
  const [password, setPassword] = useState('');
  const [imageBytes, setImageBytes] = useState<Uint8Array>(new Uint8Array());
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imageFileExtension, setImageFileExtension] = useState<string>('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfo();
  const { displayErrorMessage } = useToastListener();

  const checkSubmitButtonStatus = (): boolean => {
    return (
      !firstName ||
      !lastName ||
      !alias ||
      !password ||
      !imageUrl ||
      !imageFileExtension
    );
  };

  const listener: RegisterView = {
    setIsLoading: setIsLoading,
    displayErrorMessage: displayErrorMessage,
    navigate: navigate,
    updateUserInfo: updateUserInfo,
    setImageBytes: setImageBytes,
    setImageUrl: setImageUrl,
    setImageFileExtension: setImageFileExtension,
  };
  const [presenter] = useState(props.presenterGenerator(listener));

  const registerOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key == 'Enter' && !checkSubmitButtonStatus()) {
      presenter.doRegister(
        firstName,
        lastName,
        alias,
        password,
        rememberMe,
        imageBytes,
        imageFileExtension
      );
    }
  };

  const inputFieldGenerator = () => {
    return (
      <>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            size={50}
            id="firstNameInput"
            placeholder="First Name"
            onKeyDown={registerOnEnter}
            onChange={event => setFirstName(event.target.value)}
          />
          <label htmlFor="firstNameInput">First Name</label>
        </div>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            size={50}
            id="lastNameInput"
            placeholder="Last Name"
            onKeyDown={registerOnEnter}
            onChange={event => setLastName(event.target.value)}
          />
          {/* 50:00 duplicate code 57:47*/}
          <label htmlFor="lastNameInput">Last Name</label>
        </div>
        <AuthenticationFields
          passedInFunction={registerOnEnter}
          setAlias={setAlias}
          setPassword={setPassword}
          alias={alias}
          password={password}
        />
        <div className="form-floating mb-3">
          <input
            type="file"
            className="d-inline-block py-5 px-4 form-control"
            id="imageFileInput"
            onKeyDown={registerOnEnter}
            onChange={presenter.handleFileChange}
          />
          <label htmlFor="imageFileInput">User Image</label>
          <img src={imageUrl} className="img-thumbnail" alt=""></img>
        </div>
      </>
    );
  };

  const switchAuthenticationMethodGenerator = () => {
    return (
      <div className="mb-3">
        Algready registered? <Link to="/login">Sign in</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Register"
      submitButtonLabel="Register"
      oAuthHeading="Register with:"
      inputFieldGenerator={inputFieldGenerator}
      switchAuthenticationMethodGenerator={switchAuthenticationMethodGenerator}
      setRememberMe={setRememberMe}
      submitButtonDisabled={checkSubmitButtonStatus}
      isLoading={isLoading}
      submit={() =>
        presenter.doRegister(
          firstName,
          lastName,
          alias,
          password,
          rememberMe,
          imageBytes,
          imageFileExtension
        )
      }
    />
  );
};

export default Register;

// const doRegister = async () => {
//   try {
//     setIsLoading(true);

//     const [user, authToken] = await register(
//       firstName,
//       lastName,
//       alias,
//       password,
//       imageBytes,
//       imageFileExtension
//     );

//     updateUserInfo(user, user, authToken, rememberMe);
//     navigate("/");
//   } catch (error) {
//     displayErrorMessage(
//       `Failed to register user because of exception: ${error}`
//     );
//   } finally {
//     setIsLoading(false);
//   }
// };

// const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
//   const file = event.target.files?.[0];
//   handleImageFile(file);
// };

// const handleImageFile = (file: File | undefined) => {
//   if (file) {
//     setImageUrl(URL.createObjectURL(file));

//     const reader = new FileReader();
//     reader.onload = (event: ProgressEvent<FileReader>) => {
//       const imageStringBase64 = event.target?.result as string;

//       // Remove unnecessary file metadata from the start of the string.
//       const imageStringBase64BufferContents =
//         imageStringBase64.split('base64,')[1];

//       const bytes: Uint8Array = Buffer.from(
//         imageStringBase64BufferContents,
//         'base64'
//       );

//       setImageBytes(bytes);
//     };
//     reader.readAsDataURL(file);

//     // Set image file extension (and move to a separate method)
//     const fileExtension = getFileExtension(file);
//     if (fileExtension) {
//       setImageFileExtension(fileExtension);
//     }
//   } else {
//     setImageUrl('');
//     setImageBytes(new Uint8Array());
//   }
// };

// const getFileExtension = (file: File): string | undefined => {
//   return file.name.split('.').pop();
// };
