import { FakeData, GetFeedRequest, Status } from 'tweeter-shared';
import { StatusDto } from 'tweeter-shared/src/model/dto/StatusDto';
import { ServerFacade } from '../net/ServerFacade';
export class StatusService {
  private serverFacade: ServerFacade;

  public constructor() {
    this.serverFacade = new ServerFacade();
  }

  public async loadMoreFeed(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    const request: GetFeedRequest = {
      token: token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem,
    };
    return this.serverFacade.getMoreFeed(request);
  }

  public async loadMoreStory(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    return this.getFakeData(lastItem, pageSize);
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

  private async getFakeData(
    lastItem: StatusDto | null,
    pageSize: number
  ): Promise<[StatusDto[], boolean]> {
    const [items, hasMore] = FakeData.instance.getPageOfStatuses(
      Status.fromDto(lastItem),
      pageSize
    );
    const dtos = items.map(status => status.dto);
    return [dtos, hasMore];
  }
}
