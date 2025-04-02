import { User, UserDto } from 'tweeter-shared';

import { AuthTokenDto } from 'tweeter-shared';

export interface IAuthDao {
  login(alias: string, password: string): Promise<[UserDto, AuthTokenDto]>;
  register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageStringBase64: string,
    imageFileExtension: string
  ): Promise<[UserDto, AuthTokenDto]>;
  logout(authToken: AuthTokenDto): Promise<void>;
}
