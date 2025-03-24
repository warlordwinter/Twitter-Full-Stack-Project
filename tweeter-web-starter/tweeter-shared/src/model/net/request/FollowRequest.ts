import { UserDto } from '../../dto/UserDto';

export interface FollowRequest {
  token: string;
  userToFollow: UserDto;
}
