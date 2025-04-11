import { FakeData, Status } from 'tweeter-shared';
import { StatusDto } from 'tweeter-shared/src/model/dto/StatusDto';
import { IDaoFactory } from '../../dao/interfaces/IDaoFactory';
import { IStatusDao } from '../../dao/interfaces/IStatusDao';
import { IAuthenticator } from '../../dao/interfaces/IAuthenticator';
import { DynamoDBAuthenticator } from '../../dao/implementations/dynamodb/DynamoDBAuthenticator';

export class StatusService {
  private statusDao: IStatusDao;
  private authenticator: IAuthenticator;

  constructor(daoFactory: IDaoFactory) {
    this.statusDao = daoFactory.createStatusDao();
    this.authenticator = new DynamoDBAuthenticator();
  }

  public async loadMoreFeed(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    if (!(await this.authenticator.authenticate(token))) {
      throw new Error('Invalid token');
    }
    throw new Error('Not implemented');
  }

  public async loadMoreStory(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    if (!(await this.authenticator.authenticate(token))) {
      throw new Error('Invalid token');
    }
    return this.statusDao.getPageOfStory(userAlias, pageSize, lastItem);
  }

  public async postStatus(token: string, newStatus: StatusDto): Promise<void> {
    if (!(await this.authenticator.authenticate(token))) {
      throw new Error('Invalid token');
    }
    await this.statusDao.postStory(token, newStatus);
    await this.statusDao.postFeed(token, newStatus);
  }
}
