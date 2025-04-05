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
  // register is working correctly
  const [userDto, authTokenDto] = await authenticationService.register(
    requests.firstName,
    requests.lastName,
    requests.alias,
    requests.password,
    requests.userImageBytes,
    requests.imageFileExtension
  );
  console.log('user', userDto);
  console.log('Authtoken');
  return {
    success: true,
    message: null,
    user: userDto,
    authToken: authTokenDto,
  };
};
