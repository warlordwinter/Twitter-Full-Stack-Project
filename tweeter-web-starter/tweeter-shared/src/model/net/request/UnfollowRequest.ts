import { UserDto } from '../../dto/UserDto';

export interface UnfollowRequest {
  token: string;
  userToUnfollow: UserDto;
}
