import { PagedUserItemRequest } from 'tweeter-shared/src/model/net/request/PagedUserItemRequest';
import { PagedUserItemResponse } from 'tweeter-shared/src/model/net/response/PagedUserItemResponse';
import { FollowService } from '../../model/service/FollowService';
import { DyanmoDBFactory } from '../../dao/factories/DynamoDBFactory';

export const handler = async (
  requests: PagedUserItemRequest
): Promise<PagedUserItemResponse> => {
  const followService = new FollowService(new DyanmoDBFactory());
  const [items, hasMore] = await followService.loadMoreFollowees(
    requests.token,
    requests.userAlias,
    requests.pageSize,
    requests.lastItem
  );
  return {
    success: true,
    message: null,
    items: items,
    hasMore: hasMore,
  };
};
