import { UserDto } from '../../dto/UserDto';
import { AuthTokenDto } from '../../dto/AuthTokenDto';
import { TweeterResponse } from './TweeterResponse';

export interface LoginResponse extends TweeterResponse {
  user: UserDto;
  authToken: AuthTokenDto;
}
