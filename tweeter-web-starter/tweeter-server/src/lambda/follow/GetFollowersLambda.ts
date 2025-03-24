import { PagedUserItemRequest } from 'tweeter-shared/src/model/net/request/PagedUserItemRequest';
import { PagedUserItemResponse } from 'tweeter-shared/src/model/net/response/PagedUserItemResponse';
import { FollowService } from '../../model/service/FollowService';

export const handler = async (
  requests: PagedUserItemRequest
): Promise<PagedUserItemResponse> => {
  const followService = new FollowService();
  const [items, hasMore] = await followService.loadMoreFollowers(
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
