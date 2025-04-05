import {
  FakeData,
  GetFeedRequest,
  PostStatusRequest,
  Status,
} from 'tweeter-shared';
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
      lastItem: lastItem?.dto ?? null,
    };
    return this.serverFacade.getMoreFeed(request);
  }

  public async loadMoreStory(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    const request: GetFeedRequest = {
      token: token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem?.dto ?? null,
    };
    return this.serverFacade.getMoreStory(request);
  }

  public async postStatus(token: string, newStatus: Status): Promise<void> {
    // Pause so we can see the logging out message. Remove when connected to the server
    try {
      await new Promise(f => setTimeout(f, 2000));
    } catch (error) {
      console.log('error in service');
    }
    // TODO: Call the server to post the status
    const request: PostStatusRequest = {
      token: token,
      newStatus: newStatus.dto,
    };
    return this.serverFacade.postStatus(request);
  }

  // private async getFakeData(
  //   lastItem: StatusDto | null,
  //   pageSize: number
  // ): Promise<[StatusDto[], boolean]> {
  //   const [items, hasMore] = FakeData.instance.getPageOfStatuses(
  //     Status.fromDto(lastItem),
  //     pageSize
  //   );
  //   const dtos = items.map(status => status.dto);
  //   return [dtos, hasMore];
  // }
}
