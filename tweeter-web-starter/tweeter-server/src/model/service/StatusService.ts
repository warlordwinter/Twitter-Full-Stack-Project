import { StatusDto } from 'tweeter-shared/src/model/dto/StatusDto';
import { IDaoFactory } from '../../dao/interfaces/IDaoFactory';
import { IStatusDao } from '../../dao/interfaces/IStatusDao';
import { IAuthenticator } from '../../dao/interfaces/IAuthenticator';
import { DynamoDBAuthenticator } from '../../dao/implementations/dynamodb/DynamoDBAuthenticator';
import { IFollowDao } from '../../dao/interfaces/IFollowDao';
export class StatusService {
  private statusDao: IStatusDao;
  private authenticator: IAuthenticator;
  private followDao: IFollowDao;

  constructor(daoFactory: IDaoFactory) {
    this.statusDao = daoFactory.createStatusDao();
    this.authenticator = new DynamoDBAuthenticator();
    this.followDao = daoFactory.createFollowDao();
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
    return this.statusDao.getPageOfFeed(userAlias, pageSize, lastItem);
  }

  public async getPostsFromFollowing(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    if (!(await this.authenticator.authenticate(token))) {
      throw new Error('Invalid token');
    }

    const [followees, hasMoreFollowees] = await this.followDao.getFollowees(
      userAlias,
      1000,
      null
    );

    const allPosts: StatusDto[] = [];
    for (const followee of followees) {
      if (followee.alias === userAlias) continue;

      try {
        const [posts] = await this.statusDao.getPageOfFeed(
          followee.alias,
          pageSize,
          lastItem
        );
        allPosts.push(...posts);
      } catch (error) {
        console.error(`Error getting posts for ${followee.alias}:`, error);
      }
    }

    allPosts.sort((a, b) => b.timestamp - a.timestamp);

    const paginatedPosts = allPosts.slice(0, pageSize);
    const hasMore = allPosts.length > pageSize;

    return [paginatedPosts, hasMore];
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
    const [followers] = await this.followDao.getFollowers(
      newStatus.user.alias,
      1000,
      null
    );

    // Extract just the aliases for batch processing
    const followerAliases = followers.map(follower => follower.alias);
    await this.statusDao.batchPostFeed(followerAliases, newStatus);
  }
}
