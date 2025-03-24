import { FakeData, Status } from 'tweeter-shared';
import { StatusDto } from 'tweeter-shared/src/model/dto/StatusDto';
export class StatusService {
  public async loadMoreFeed(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    return this.getFakeData(lastItem, pageSize);
  }

  public async loadMoreStory(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    return this.getFakeData(lastItem, pageSize);
  }
  public async postStatus(token: string, newStatus: Status): Promise<void> {
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
