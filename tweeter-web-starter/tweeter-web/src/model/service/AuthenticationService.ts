import { Buffer } from 'buffer';
import {
  User,
  FakeData,
  LoginRequest,
  RegisterRequest,
  LogoutRequest,
  AuthToken,
} from 'tweeter-shared';
import { AuthTokenDto } from 'tweeter-shared/src/model/dto/AuthTokenDto';
import { ServerFacade } from '../net/ServerFacade';

export class AuthenticationService {
  private serverFacade: ServerFacade;

  public constructor() {
    this.serverFacade = new ServerFacade();
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {
    const request: LoginRequest = {
      alias: alias,
      password: password,
    };

    const response = await this.serverFacade.login(request);
    const user = User.fromDto(response?.user ?? null);

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
  ): Promise<[User, AuthToken]> {
    // Not neded now, but will be needed when you make the request to the server in milestone 3
    const imageStringBase64: string =
      Buffer.from(userImageBytes).toString('base64');

    // TODO: Replace with the result of calling the server
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error('Invalid registration');
    }

    return [user, FakeData.instance.authToken];
  }

  public async logout(authToken: AuthTokenDto): Promise<void> {
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    await new Promise(res => setTimeout(res, 1000));
  }
}
