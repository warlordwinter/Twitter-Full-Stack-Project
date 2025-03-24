import { UserService } from '../../model/service/UserService';
import { FollowResponse } from 'tweeter-shared/src/model/net/response/FollowResponse';
import { FollowRequest } from 'tweeter-shared/src/model/net/request/FollowRequest';

export const handler = async (
  requests: FollowRequest
): Promise<FollowResponse> => {
  const userService = new UserService();
  const [followerCount, followeeCount] = await userService.unfollow(
    requests.token,
    requests.userToFollow
  );
  return {
    success: true,
    message: null,
    followerCount,
    followeeCount,
  };
};
