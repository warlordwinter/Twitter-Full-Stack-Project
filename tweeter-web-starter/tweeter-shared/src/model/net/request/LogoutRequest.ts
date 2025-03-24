import { AuthTokenDto } from '../../dto/AuthTokenDto';

export interface LogoutRequest {
  authToken: AuthTokenDto;
}
