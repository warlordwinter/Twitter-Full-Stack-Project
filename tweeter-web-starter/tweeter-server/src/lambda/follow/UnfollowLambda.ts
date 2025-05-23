import { UserService } from '../../model/service/UserService';
import { FollowResponse } from 'tweeter-shared/src/model/net/response/FollowResponse';
import { UnfollowRequest } from 'tweeter-shared/src/model/net/request/UnfollowRequest';

export const handler = async (
  requests: UnfollowRequest
): Promise<FollowResponse> => {
  const userService = new UserService();
  const [followerCount, followeeCount] = await userService.unfollow(
    requests.token,
    requests.userToUnfollow
  );
  return {
    success: true,
    message: null,
    followerCount,
    followeeCount,
  };
};
