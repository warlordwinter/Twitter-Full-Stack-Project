import { StatusDto } from 'tweeter-shared';

export interface IStatusDao {
  getPageOfStory(
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]>;

  postFeed(token: string, newStatus: StatusDto): Promise<void>;
  postStory(token: string, newStatus: StatusDto): Promise<void>;
  getPageOfFeed(
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]>;
  postFeed(receiver_alias: string, newStatus: StatusDto): Promise<void>;
  batchPostFeed(
    receiver_aliases: string[],
    newStatus: StatusDto
  ): Promise<void>;
}
