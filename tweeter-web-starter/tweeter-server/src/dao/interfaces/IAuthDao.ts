import { User } from 'tweeter-shared';

import { AuthTokenDto } from 'tweeter-shared';

export interface IAuthDao {
  login(alias: string, password: string): Promise<[User, AuthTokenDto]>;
  register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageStringBase64: string,
    imageFileExtension: string
  ): Promise<[User, AuthTokenDto]>;
  logout(authToken: AuthTokenDto): Promise<void>;
}
