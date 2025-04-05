import { StatusDto } from 'tweeter-shared';

export interface IStatusDao {
  postStatus(token: string, newStatus: StatusDto): Promise<void>;
  getFeed(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]>;
  getStory(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]>;
}
