import { UserDto } from '../../dto/UserDto';
import { TweeterResponse } from './TweeterResponse';
import { AuthTokenDto } from '../../dto/AuthTokenDto';
export interface RegisterResponse extends TweeterResponse {
  user: UserDto;
  authToken: AuthTokenDto;
}
