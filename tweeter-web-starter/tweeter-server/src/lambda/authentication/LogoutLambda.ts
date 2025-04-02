import { AuthenticationService } from '../../model/service/AuthenticationService';
import { LogoutRequest } from 'tweeter-shared/src/model/net/request/LogoutRequest';
import { LogoutResponse } from 'tweeter-shared/src/model/net/response/LogoutResponse';
import { AuthTokenDto } from 'tweeter-shared/src/model/dto/AuthTokenDto';
import { DyanmoDBFactory } from '../../dao/factories/DynamoDBFactory';

export const handler = async (
  requests: LogoutRequest
): Promise<LogoutResponse> => {
  const authenticationService = new AuthenticationService(
    new DyanmoDBFactory()
  );
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
