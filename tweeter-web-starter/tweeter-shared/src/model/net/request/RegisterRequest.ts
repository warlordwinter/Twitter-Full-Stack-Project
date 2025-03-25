import { AuthRequest } from './AuthRequest';

export interface RegisterRequest extends AuthRequest {
  readonly firstName: string;
  readonly lastName: string;
  readonly alias: string;
  readonly password: string;
  readonly userImageBytes: Uint8Array;
  readonly imageFileExtension: string;
}
