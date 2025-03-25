import { Buffer } from 'buffer';
import { User, FakeData, AuthToken } from 'tweeter-shared';
import { AuthTokenDto } from 'tweeter-shared/src/model/dto/AuthTokenDto';

export class AuthenticationService {
  public async login(
    alias: string,
    password: string
  ): Promise<[User, AuthTokenDto]> {
    // TODO: Replace with the result of calling the server
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error('Invalid alias or password');
    }

    return [user, FakeData.instance.authToken];
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[User, AuthTokenDto]> {
    // Not neded now, but will be needed when you make the request to the server in milestone 3
    const imageStringBase64: string =
      Buffer.from(userImageBytes).toString('base64');

    // TODO: Replace with the result of calling the server
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error('Invalid registration');
    }
    const authToken: AuthToken = FakeData.instance.authToken;
    return [user, authToken.dto];
  }

  public async logout(authToken: AuthTokenDto): Promise<void> {
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    await new Promise(res => setTimeout(res, 1000));
  }
}
