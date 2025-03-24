import { UserService } from '../../model/service/UserService';
import { PagedUserItemRequest } from 'tweeter-shared/src/model/net/request/GetFolloweeCountRequest';

export const handler = async (
  requests: 
): Promise<GetFollowResponse> => {
  const userService = new UserService();
  const ji = await userService.getFolloweeCount(
    requests.token,
    requests.userDto
  );
};
