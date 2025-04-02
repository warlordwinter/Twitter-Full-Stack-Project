import { AuthenticationService } from '../../model/service/AuthenticationService';
import { RegisterRequest } from 'tweeter-shared/src/model/net/request/RegisterRequest';
import { RegisterResponse } from 'tweeter-shared/src/model/net/response/RegisterResponse';
import { DyanmoDBFactory } from '../../dao/factories/DynamoDBFactory';

export const handler = async (
  requests: RegisterRequest
): Promise<RegisterResponse> => {
  const authenticationService = new AuthenticationService(
    new DyanmoDBFactory()
  );
  const [user, authTokenDto] = await authenticationService.register(
    requests.alias,
    requests.password,
    requests.firstName,
    requests.lastName,
    requests.userImageBytes,
    requests.imageFileExtension
  );
  return {
    success: true,
    message: null,
    user: user.dto,
    authToken: authTokenDto,
  };
};
