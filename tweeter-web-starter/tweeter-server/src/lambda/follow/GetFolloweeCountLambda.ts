import { UserService } from '../../model/service/UserService';
import { GetCountRequest } from 'tweeter-shared/src/model/net/request/GetCountRequest';
import { GetCountResponse } from 'tweeter-shared/src/model/net/response/GetCountResponse';

export const handler = async (
  requests: GetCountRequest
): Promise<GetCountResponse> => {
  const userService = new UserService(); // from this request call and create a userservice.
  const count = await userService.getFolloweeCount(
    requests.token,
    requests.user
  );
  return {
    success: true,
    message: null,
    value: count,
  };
};
