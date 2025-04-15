import { StatusDto } from 'tweeter-shared/src/model/dto/StatusDto';
import { UserDto } from 'tweeter-shared';
import { IDaoFactory } from '../../dao/interfaces/IDaoFactory';
import { IStatusDao } from '../../dao/interfaces/IStatusDao';
import { IAuthenticator } from '../../dao/interfaces/IAuthenticator';
import { DynamoDBAuthenticator } from '../../dao/implementations/dynamodb/DynamoDBAuthenticator';
import { IFollowDao } from '../../dao/interfaces/IFollowDao';
import {
  SendMessageCommand,
  SendMessageBatchCommand,
  SQSClient,
} from '@aws-sdk/client-sqs';

const FOLLOWERS_PER_JOB = 25; // Number of followers to process in each job
const BATCH_SIZE = 10; // SQS batch size limit

export class StatusService {
  private statusDao: IStatusDao;
  private authenticator: IAuthenticator;
  private followDao: IFollowDao;
  private sqsClient: SQSClient;
  private readonly postQueueUrl: string;
  private readonly jobQueueUrl: string;

  constructor(daoFactory: IDaoFactory) {
    this.statusDao = daoFactory.createStatusDao();
    this.authenticator = new DynamoDBAuthenticator();
    this.followDao = daoFactory.createFollowDao();
    this.sqsClient = new SQSClient({
      region: 'us-west-2',
      maxAttempts: 3,
      requestHandler: {
        connectionTimeout: 1000,
        socketTimeout: 1000,
        maxSockets: 50,
      },
    });
    this.postQueueUrl =
      'https://sqs.us-west-2.amazonaws.com/787386855542/post-status-queue';
    this.jobQueueUrl =
      'https://sqs.us-west-2.amazonaws.com/787386855542/update-feed-queue';
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
    try {
      // Just post to the user's story and queue the status
      await this.statusDao.postStory(token, newStatus);

      // Queue the status for processing
      const command = new SendMessageCommand({
        QueueUrl: this.postQueueUrl,
        MessageBody: JSON.stringify(newStatus),
      });
      await this.sqsClient.send(command);
    } catch (error) {
      console.error('Error in postStatus:', error);
      throw error;
    }
  }

  public async processNewStatus(newStatus: StatusDto): Promise<void> {
    try {
      // Get all followers
      const [followers] = await this.followDao.getFollowers(
        newStatus.user.alias,
        1000,
        null
      );

      // Split followers into jobs
      const jobs = [];
      for (let i = 0; i < followers.length; i += FOLLOWERS_PER_JOB) {
        const jobFollowers = followers.slice(i, i + FOLLOWERS_PER_JOB);
        jobs.push({
          followerAliases: jobFollowers.map(f => f.alias),
          newStatus: newStatus,
        });
      }

      // Send jobs to queue in batches
      for (let i = 0; i < jobs.length; i += BATCH_SIZE) {
        const batch = jobs.slice(i, i + BATCH_SIZE);
        const messages = batch.map((job, index) => ({
          Id: `message_${i + index}`,
          MessageBody: JSON.stringify(job),
        }));

        const command = new SendMessageBatchCommand({
          QueueUrl: this.jobQueueUrl,
          Entries: messages,
        });
        await this.sqsClient.send(command);
        console.log(`Sent batch of ${batch.length} jobs to job queue`);
      }
    } catch (error) {
      console.error('Error processing new status:', error);
      throw error;
    }
  }

  public async processFeedJob(
    followerAliases: string[],
    newStatus: StatusDto
  ): Promise<void> {
    await this.statusDao.batchPostFeed(followerAliases, newStatus);
  }
}
