import { TweeterRequest } from './TweeterRequest';

export interface LogoutRequest extends Omit<TweeterRequest, 'token'> {
  readonly authToken: string;
}
