import { UserService } from '../../model/service/UserService';
import { GetCountRequest } from 'tweeter-shared/src/model/net/request/GetCountRequest';
import { GetCountResponse } from 'tweeter-shared/src/model/net/response/GetCountResponse';
import { DyanmoDBFactory } from '../../dao/factories/DynamoDBFactory';
export const handler = async (
  requests: GetCountRequest
): Promise<GetCountResponse> => {
  const userService = new UserService(new DyanmoDBFactory()); // from this request call and create a userservice.
  const count = await userService.getFollowerCount(
    requests.token,
    requests.user
  );
  return {
    success: true,
    message: null,
    value: count,
  };
};
