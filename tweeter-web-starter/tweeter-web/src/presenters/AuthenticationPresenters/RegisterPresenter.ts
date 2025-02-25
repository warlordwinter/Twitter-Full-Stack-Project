import { AuthenticationService } from '../../model/service/AuthenticationService';
import { ChangeEvent } from 'react';
import { Buffer } from 'buffer';
import { AuthView } from './AuthPresenter';

export interface RegisterView extends AuthView {
  setImageBytes: React.Dispatch<React.SetStateAction<Uint8Array>>;
  setImageUrl: React.Dispatch<React.SetStateAction<string>>;
  setImageFileExtension: React.Dispatch<React.SetStateAction<string>>;
}

export class RegisterPresenter {
  public view: RegisterView;
  public registerService: AuthenticationService;

  constructor(view: RegisterView) {
    this.view = view;
    this.registerService = new AuthenticationService();
  }

  public async doRegister(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    rememberMe: boolean,
    imageBytes: Uint8Array,
    imageFileExtension: string
  ) {
    try {
      this.view.setIsLoading(true);

      const [user, authToken] = await this.registerService.register(
        firstName,
        lastName,
        alias,
        password,
        imageBytes,
        imageFileExtension
      );

      this.view.updateUserInfo(user, user, authToken, rememberMe);
      this.view.navigate('/');
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to register user because of exception: ${error}`
      );
    } finally {
      this.view.setIsLoading(false);
    }
  }

  public handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    this.handleImageFile(file);
  };

  public handleImageFile = (file: File | undefined) => {
    if (file) {
      this.view.setImageUrl(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageStringBase64 = event.target?.result as string;

        // Remove unnecessary file metadata from the start of the string.
        const imageStringBase64BufferContents =
          imageStringBase64.split('base64,')[1];

        const bytes: Uint8Array = Buffer.from(
          imageStringBase64BufferContents,
          'base64'
        );

        this.view.setImageBytes(bytes);
      };
      reader.readAsDataURL(file);

      // Set image file extension (and move to a separate method)
      const fileExtension = this.getFileExtension(file);
      if (fileExtension) {
        this.view.setImageFileExtension(fileExtension);
      }
    } else {
      this.view.setImageUrl('');
      this.view.setImageBytes(new Uint8Array());
    }
  };

  public getFileExtension = (file: File): string | undefined => {
    return file.name.split('.').pop();
  };
}
