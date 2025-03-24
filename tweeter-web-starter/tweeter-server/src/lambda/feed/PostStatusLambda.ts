import { PostStatusRequest } from 'tweeter-shared/src/model/net/request/postStatusRequest';
import { PostStatusResponse } from 'tweeter-shared/src/model/net/response/PostStatusResponse';
import { StatusService } from '../../model/service/StatusService';

export const handler = async (
  request: PostStatusRequest
): Promise<PostStatusResponse> => {
  const statusService = new StatusService();
  await statusService.postStatus(request.token, request.newStatus);
  return {
    success: true,
    message: null,
  };
};
