import { Buffer } from 'buffer';
import {
  User,
  LoginRequest,
  RegisterRequest,
  LogoutRequest,
  AuthToken,
} from 'tweeter-shared';
import { AuthTokenDto } from 'tweeter-shared/src/model/dto/AuthTokenDto';
import { ServerFacade } from '../net/ServerFacade';
import { TweeterRequest } from 'tweeter-shared/dist/model/net/request/TweeterRequest';

export class AuthenticationService {
  private serverFacade: ServerFacade;

  public constructor() {
    this.serverFacade = new ServerFacade();
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {
    const request: LoginRequest & TweeterRequest = {
      alias: alias,
      password: password,
      token: '',
    };

    const response = await this.serverFacade.login(request);
    const user = User.fromDto(response?.user ?? null);

    // Login response has authToken as string
    const authTokenDto: AuthTokenDto = {
      token: response?.authToken ?? '',
      timestamp: Date.now(),
    };
    const authToken = AuthToken.fromDto(authTokenDto);

    if (user === null || authToken === null) {
      throw new Error('Invalid alias or password');
    }

    return [user, authToken];
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {
    const request: RegisterRequest & TweeterRequest = {
      firstName: firstName,
      lastName: lastName,
      alias: alias,
      password: password,
      userImageBytes: userImageBytes,
      imageFileExtension: imageFileExtension,
      token: '',
    };

    const response = await this.serverFacade.register(request);
    const user = User.fromDto(response?.user ?? null);
    const authToken = AuthToken.fromDto(response?.authToken ?? null);

    if (user === null || authToken === null) {
      throw new Error('Invalid registration');
    }

    return [user, authToken];
  }

  public async logout(authToken: AuthTokenDto): Promise<void> {
    const request: LogoutRequest & TweeterRequest = {
      authToken: authToken.token,
      token: '',
    };

    await this.serverFacade.logout(request);
  }
}
