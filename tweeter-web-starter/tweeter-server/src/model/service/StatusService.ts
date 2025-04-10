import { StatusDto } from 'tweeter-shared/src/model/dto/StatusDto';
import { IDaoFactory } from '../../dao/interfaces/IDaoFactory';
import { IStatusDao } from '../../dao/interfaces/IStatusDao';

export class StatusService {
  private statusDao: IStatusDao;

  constructor(daoFactory: IDaoFactory) {
    this.statusDao = daoFactory.createStatusDao();
  }

  public async loadMoreFeed(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    return this.statusDao.getFeed(token, userAlias, pageSize, lastItem);
  }

  public async loadMoreStory(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    return this.statusDao.getStory(token, userAlias, pageSize, lastItem);
  }

  public async postStatus(token: string, newStatus: StatusDto): Promise<void> {
    // Pause so we can see the logging out message. Remove when connected to the server
    try {
      await new Promise(f => setTimeout(f, 2000));
    } catch (error) {
      console.log('error in service');
    }
    // TODO: Call the server to post the status
  }
}
