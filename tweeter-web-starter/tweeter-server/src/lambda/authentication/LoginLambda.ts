import { AuthenticationService } from '../../model/service/AuthenticationService';
import { LoginRequest } from 'tweeter-shared/src/model/net/request/LoginRequest';
import { LoginResponse } from 'tweeter-shared/src/model/net/response/LoginResponse';

export const handler = async (
  requests: LoginRequest
): Promise<LoginResponse> => {
  const authenticationService = new AuthenticationService();
  const [user, authTokenDto] = await authenticationService.login(
    requests.alias,
    requests.password
  );
  return {
    success: true,
    message: null,
    user: user.dto,
    authToken: authTokenDto.token,
  };
};
