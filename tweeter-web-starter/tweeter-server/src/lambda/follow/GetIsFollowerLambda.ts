import { UserService } from '../../model/service/UserService';
import { GetIsRequest } from 'tweeter-shared/src/model/net/request/GetIsRequest';
import { GetIsResponse } from 'tweeter-shared/src/model/net/response/GetIsResponse';
import { DyanmoDBFactory } from '../../dao/factories/DynamoDBFactory';
export const handler = async (
  requests: GetIsRequest
): Promise<GetIsResponse> => {
  const userService = new UserService(new DyanmoDBFactory());
  const isFollower = await userService.getIsFollowerStatus(
    requests.token,
    requests.user,
    requests.selectedUser
  );
  return {
    success: true,
    message: null,
    isFollower: isFollower,
  };
};
