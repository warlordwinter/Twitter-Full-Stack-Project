import { TweeterRequest } from 'tweeter-shared/src/model/net/request/TweeterRequest';
import { UserDto } from '../../dto/UserDto';

export interface GetUserRequest extends TweeterRequest {
  readonly alias: string;
  readonly user: UserDto;
}
