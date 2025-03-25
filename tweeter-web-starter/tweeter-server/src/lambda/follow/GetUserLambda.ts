import { GetUserRequest } from 'tweeter-shared/src/model/net/request/GetUserRequest';
import { UserService } from '../../model/service/UserService';
import { GetUserResponse } from 'tweeter-shared/src/model/net/response/GetUserResponse';

export const handler = async (
  request: GetUserRequest
): Promise<GetUserResponse> => {
  const userService = new UserService();
  const user = await userService.getUser(request.token, request.alias);
  return {
    success: true,
    message: null,
    user: user,
  };
};
