import { AuthenticationService } from '../../model/service/AuthenticationService';
import { LogoutRequest } from 'tweeter-shared/src/model/net/request/LogoutRequest';
import { LogoutResponse } from 'tweeter-shared/src/model/net/response/LogoutResponse';
import { AuthTokenDto } from 'tweeter-shared/src/model/dto/AuthTokenDto';

export const handler = async (
  requests: LogoutRequest
): Promise<LogoutResponse> => {
  const authenticationService = new AuthenticationService();
  const authTokenDto: AuthTokenDto = {
    token: requests.authToken,
    timestamp: Date.now(),
  };
  await authenticationService.logout(authTokenDto);
  return {
    success: true,
    message: null,
  };
};
