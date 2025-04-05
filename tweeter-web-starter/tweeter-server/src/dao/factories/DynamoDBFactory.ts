import { AuthDaoDynamoDB } from '../implementations/dynamodb/AuthDaoDynamoDB';
import { IAuthDao } from '../interfaces/IAuthDao';
import { IUserDao } from '../interfaces/IUserDao';
import { IDaoFactory } from '../interfaces/IDaoFactory';
import { UserDaoDynamoDB } from '../implementations/dynamodb/UserDaoDynamoDB';
import { IStatusDao } from '../interfaces/IStatusDao';
import { StatusDaoDynamoDB } from '../implementations/dynamodb/StatusDaoDynamoDB';
import { IFollowDao } from '../interfaces/IFollowDao';
import { FollowDaoDynamoDB } from '../implementations/dynamodb/FollowDaoDynamoDB';

export class DyanmoDBFactory implements IDaoFactory {
  createAuthDao(): IAuthDao {
    return new AuthDaoDynamoDB();
  }
  createUserDao(): IUserDao {
    return new UserDaoDynamoDB();
  }
  createStatusDao(): IStatusDao {
    return new StatusDaoDynamoDB();
  }
  createFollowDao(): IFollowDao {
    return new FollowDaoDynamoDB();
  }
}
