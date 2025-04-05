import { PostStatusResponse } from 'tweeter-shared/src/model/net/response/PostStatusResponse';
import { StatusService } from '../../model/service/StatusService';
import { PostStatusRequest } from 'tweeter-shared/src/model/net/request/PostStatusRequest';
import { DyanmoDBFactory } from '../../dao/factories/DynamoDBFactory';
export const handler = async (
  request: PostStatusRequest
): Promise<PostStatusResponse> => {
  const statusService = new StatusService(new DyanmoDBFactory());
  await statusService.postStatus(request.token, request.newStatus);
  return {
    success: true,
    message: null,
  };
};
