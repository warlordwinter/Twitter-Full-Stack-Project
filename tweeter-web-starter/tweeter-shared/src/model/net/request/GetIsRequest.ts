import { UserDto } from '../../dto/UserDto';

export interface GetIsRequest {
  token: string;
  user: UserDto;
  selectedUser: UserDto;
}
