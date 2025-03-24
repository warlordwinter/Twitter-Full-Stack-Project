import { UserDto } from '../../dto/UserDto';
import { AuthTokenDto } from '../../dto/AuthTokenDto';
export interface LoginResponse {
  success: boolean;
  message: string | null;
  user: UserDto;
  authToken: AuthTokenDto;
}
