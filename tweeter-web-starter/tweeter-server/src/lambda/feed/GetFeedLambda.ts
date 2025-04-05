import { GetFeedRequest } from 'tweeter-shared/src/model/net/request/GetFeedRequest';
import { GetFeedResponse } from 'tweeter-shared/src/model/net/response/GetFeedResponse';
import { StatusService } from '../../model/service/StatusService';
import { DyanmoDBFactory } from '../../dao/factories/DynamoDBFactory';
export const handler = async (
  requests: GetFeedRequest
): Promise<GetFeedResponse> => {
  const statusService = new StatusService(new DyanmoDBFactory());
  const [statuses, hasMore] = await statusService.loadMoreFeed(
    requests.token,
    requests.userAlias,
    requests.pageSize,
    requests.lastItem
  );
  return {
    success: true,
    message: null,
    statuses: statuses,
    hasMore: hasMore,
  };
};
