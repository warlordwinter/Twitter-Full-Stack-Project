import { AuthDaoDynamoDB } from '../implementations/dynamodb/AuthDaoDynamoDB';
import { IAuthDao } from '../interfaces/IAuthDao';
import { IUserDao } from '../interfaces/IUserDao';
import { IDaoFactory } from '../interfaces/IDaoFactory';
import { UserDaoDynamoDB } from '../implementations/dynamodb/UserDaoDynamoDB';

export class DyanmoDBFactory implements IDaoFactory {
  createAuthDao(): IAuthDao {
    return new AuthDaoDynamoDB();
  }
  createFollowDao(): IUserDao {
    return new UserDaoDynamoDB();
  }
}
