import { StatusDto } from 'tweeter-shared';

export interface IStatusDao {
  getPageOfStory(
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]>;

  postFeed(token: string, newStatus: StatusDto): Promise<void>;
  postStory(token: string, newStatus: StatusDto): Promise<void>;
}
