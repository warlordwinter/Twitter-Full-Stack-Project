import { UserService } from '../../model/service/UserService';
import { FollowResponse } from 'tweeter-shared/src/model/net/response/FollowResponse';
import { FollowRequest } from 'tweeter-shared/src/model/net/request/FollowRequest';
import { DyanmoDBFactory } from '../../dao/factories/DynamoDBFactory';

export const handler = async (
  requests: FollowRequest
): Promise<FollowResponse> => {
  const userService = new UserService(new DyanmoDBFactory());
  const [followerCount, followeeCount] = await userService.follow(
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
