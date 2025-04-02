import { TweeterRequest } from './TweeterRequest';

export interface RegisterRequest extends Omit<TweeterRequest, 'token'> {
  readonly firstName: string;
  readonly lastName: string;
  readonly alias: string;
  readonly password: string;
  readonly userImageBytes: Uint8Array;
  readonly imageFileExtension: string;
}
