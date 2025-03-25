import { AuthTokenDto } from '../../dto/AuthTokenDto';
import { AuthRequest } from './AuthRequest';

export interface LogoutRequest extends AuthRequest {
  readonly authToken: AuthTokenDto;
}
