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

export class StatusService {
  private statusDao: IStatusDao;
  private authenticator: IAuthenticator;
  private followDao: IFollowDao;
  private sqsClient: SQSClient;
  constructor(daoFactory: IDaoFactory) {
    this.statusDao = daoFactory.createStatusDao();
    this.authenticator = new DynamoDBAuthenticator();
    this.followDao = daoFactory.createFollowDao();
    this.sqsClient = new SQSClient({ region: 'us-west-2' });
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

  public async batchPostFeed(
    followerAliases: string[],
    newStatus: StatusDto
  ): Promise<void> {
    await this.statusDao.batchPostFeed(followerAliases, newStatus);
  }

  public async postStatus(token: string, newStatus: StatusDto): Promise<void> {
    try {
      // First update the user's story
      await this.statusDao.postStory(token, newStatus);

      // Get all followers
      const [followers] = await this.followDao.getFollowers(
        newStatus.user.alias,
        1000,
        null
      );

      // Prepare batch of messages (SQS allows max 10 messages per batch)
      const BATCH_SIZE = 10;
      const FOLLOWERS_PER_MESSAGE = 25;
      const batchedFollowerAliases = [];

      for (let i = 0; i < followers.length; i += FOLLOWERS_PER_MESSAGE) {
        const batch = followers
          .slice(i, i + FOLLOWERS_PER_MESSAGE)
          .map(f => f.alias);
        batchedFollowerAliases.push(batch);
      }

      const messages = batchedFollowerAliases.map((aliasBatch, index) => ({
        Id: `message_${index}`,
        MessageBody: JSON.stringify({
          followerAliases: aliasBatch,
          newStatus,
        }),
      }));

      // Send messages in batches of 10
      for (let i = 0; i < messages.length; i += BATCH_SIZE) {
        const batch = messages.slice(i, i + BATCH_SIZE);
        const command = new SendMessageBatchCommand({
          QueueUrl:
            'https://sqs.us-west-2.amazonaws.com/787386855542/update-feed-queue-20250414192537',
          Entries: batch,
        });
        await this.sqsClient.send(command);
      }
    } catch (error) {
      console.error('Error in postStatus:', error);
      throw error;
    }
  }

  public async updateFeeds(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<void> {
    // Get the user's followers (people who follow them)
    const [followers] = await this.followDao.getFollowers(
      userAlias,
      1000,
      null
    );

    // Prepare batch of messages (SQS allows max 10 messages per batch)
    const BATCH_SIZE = 10;
    const messages = followers.map((followee, index) => ({
      Id: `message_${index}`,
      MessageBody: JSON.stringify({
        token: token,
        followerAlias: userAlias,
        followeeAlias: followee.alias,
        pageSize: pageSize,
        lastItem: lastItem,
      }),
    }));

    // Process messages in smaller chunks to prevent socket exhaustion
    const CHUNK_SIZE = 5; // Process 5 batches at a time
    for (let i = 0; i < messages.length; i += BATCH_SIZE * CHUNK_SIZE) {
      const chunk = messages.slice(i, i + BATCH_SIZE * CHUNK_SIZE);

      // Process each batch in the chunk
      const batchPromises = [];
      for (let j = 0; j < chunk.length; j += BATCH_SIZE) {
        const batch = chunk.slice(j, j + BATCH_SIZE);
        const command = new SendMessageBatchCommand({
          QueueUrl:
            'https://sqs.us-west-2.amazonaws.com/787386855542/update-feed-queue-20250414192537',
          Entries: batch,
        });
        batchPromises.push(this.sqsClient.send(command));
      }

      // Wait for all batches in this chunk to complete
      await Promise.all(batchPromises);

      // Add a small delay between chunks to prevent socket exhaustion
      if (i + BATCH_SIZE * CHUNK_SIZE < messages.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  }
}
