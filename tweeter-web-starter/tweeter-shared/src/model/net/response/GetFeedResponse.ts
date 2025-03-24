import { StatusDto } from '../../dto/StatusDto';
import { TweeterResponse } from './TweeterResponse';

export interface GetFeedResponse extends TweeterResponse {
  statuses: StatusDto[];
  hasMore: boolean;
}
