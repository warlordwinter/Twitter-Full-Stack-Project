import { AuthenticationService } from '../../model/service/AuthenticationService';
import { LogoutRequest } from 'tweeter-shared/src/model/net/request/LogoutRequest';
import { LogoutResponse } from 'tweeter-shared/src/model/net/response/LogoutResponse';

export const handler = async (
  requests: LogoutRequest
): Promise<LogoutResponse> => {
  const authenticationService = new AuthenticationService();
  await authenticationService.logout(requests.authToken);
  return {
    success: true,
    message: null,
  };
};
