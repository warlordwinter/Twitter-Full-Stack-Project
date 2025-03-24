import { UserService } from '../../model/service/UserService';
import { GetFolloweeCountRequest } from 'tweeter-shared/src/model/net/request/GetFolloweeCountRequest';
import { GetFolloweeCountResponse } from 'tweeter-shared/src/model/net/response/GetFolloweeCountResponse';

export const handler = async (
  requests: GetFolloweeCountRequest
): Promise<GetFolloweeCountResponse> => {
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
