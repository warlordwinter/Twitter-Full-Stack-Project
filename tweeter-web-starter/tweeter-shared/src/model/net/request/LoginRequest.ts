import { AuthRequest } from './AuthRequest';

export interface LoginRequest extends AuthRequest {
  readonly alias: string;
  readonly password: string;
}
