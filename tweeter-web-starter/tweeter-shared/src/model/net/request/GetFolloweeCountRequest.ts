import { UserDto } from '../../dto/UserDto';

export interface GetFolloweeCountRequest {
  readonly token: string;
  readonly userDto: UserDto;
}
