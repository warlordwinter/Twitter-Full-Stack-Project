import { AuthDaoDynamoDB } from '../implementations/dynamodb/AuthDaoDynamoDB';
import { IAuthDao } from '../interfaces/IAuthDao';
import { IDaoFactory } from '../interfaces/IDaoFactory';

export class DyanmoDBFactory implements IDaoFactory {
  createAuthDao(): IAuthDao {
    return new AuthDaoDynamoDB();
  }
}
