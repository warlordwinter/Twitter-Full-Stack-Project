import { TweeterResponse } from './TweeterResponse';

export interface GetIsResponse extends TweeterResponse {
  isFollower: boolean;
}
