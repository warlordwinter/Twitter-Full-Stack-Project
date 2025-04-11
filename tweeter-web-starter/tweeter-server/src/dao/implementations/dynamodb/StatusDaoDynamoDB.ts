import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  BatchWriteCommand,
} from '@aws-sdk/lib-dynamodb';
import { IStatusDao } from '../../interfaces/IStatusDao';
import { StatusDto } from 'tweeter-shared';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

export class StatusDaoDynamoDB implements IStatusDao {
  private readonly dynamoClient;
  private readonly region: string = 'us-west-2';
  private readonly storyTable: string = 'story';
  private readonly feedTable: string = 'feed';

  constructor() {
    this.dynamoClient = DynamoDBDocumentClient.from(
      new DynamoDBClient({ region: this.region })
    );
  }
  // make sure to figure out how to display the feed and story of those you follow or unfollow.
  async getPageOfStory(
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    const params = {
      TableName: this.storyTable,
      KeyConditionExpression: 'sender_alias = :sender_alias',
      ExpressionAttributeValues: {
        ':sender_alias': userAlias,
      },
      Limit: pageSize,
      ExclusiveStartKey: lastItem
        ? {
            sender_alias: userAlias,
            timestamp: lastItem.timestamp.toString(),
          }
        : undefined,
      ScanIndexForward: false, // if you want latest posts first
    };

    const result = await this.dynamoClient.send(new QueryCommand(params));

    const items =
      result.Items?.map(
        (item): StatusDto => ({
          post: item.post,
          user: item.user,
          timestamp: parseInt(item.timestamp),
        })
      ) || [];

    return [items, !!result.LastEvaluatedKey];
  }

  async getPageOfFeed(
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    const params = {
      TableName: this.feedTable,
      KeyConditionExpression: 'receiver_alias = :receiver_alias',
      ExpressionAttributeValues: {
        ':receiver_alias': userAlias,
      },
      Limit: pageSize,
      ExclusiveStartKey: lastItem
        ? {
            receiver_alias: userAlias,
            'isodate+sender_alias':
              lastItem.timestamp.toString() + '+' + lastItem.user.alias,
          }
        : undefined,
      ScanIndexForward: false, // if you want latest posts first
    };

    const result = await this.dynamoClient.send(new QueryCommand(params));

    const items =
      result.Items?.map(
        (item): StatusDto => ({
          post: item.post,
          user: item.user,
          timestamp: parseInt(item.timestamp),
        })
      ) || [];

    return [items, !!result.LastEvaluatedKey];
  }

  async postStory(token: string, newStatus: StatusDto): Promise<void> {
    const params = {
      TableName: this.storyTable,
      Item: {
        sender_alias: newStatus.user.alias,
        timestamp: newStatus.timestamp.toString(),
        post: newStatus.post,
        user: newStatus.user,
      },
    };
    try {
      await this.dynamoClient.send(new PutCommand(params));
    } catch (error) {
      console.error('Error posting story:', error);
      throw error;
    }
  }

  async postFeed(receiver_alias: string, newStatus: StatusDto): Promise<void> {
    const params = {
      TableName: this.feedTable,
      Item: {
        receiver_alias: receiver_alias,
        'isodate+sender_alias':
          newStatus.timestamp.toString() + '+' + newStatus.user.alias,
        post: newStatus.post,
        user: newStatus.user,
        timestamp: newStatus.timestamp.toString(),
      },
    };
    try {
      await this.dynamoClient.send(new PutCommand(params));
    } catch (error) {
      console.error('Error posting feed:', error);
      throw error;
    }
  }

  async batchPostFeed(
    receiver_aliases: string[],
    newStatus: StatusDto
  ): Promise<void> {
    // DynamoDB batch write has a limit of 25 items per batch
    const BATCH_SIZE = 25;

    for (let i = 0; i < receiver_aliases.length; i += BATCH_SIZE) {
      const batch = receiver_aliases.slice(i, i + BATCH_SIZE);
      const requestItems = {
        [this.feedTable]: batch.map(receiver_alias => ({
          PutRequest: {
            Item: {
              receiver_alias: receiver_alias,
              'isodate+sender_alias':
                newStatus.timestamp.toString() + '+' + newStatus.user.alias,
              post: newStatus.post,
              user: newStatus.user,
              timestamp: newStatus.timestamp.toString(),
            },
          },
        })),
      };

      try {
        await this.dynamoClient.send(
          new BatchWriteCommand({
            RequestItems: requestItems,
          })
        );
      } catch (error) {
        console.error('Error in batch posting feed:', error);
        throw error;
      }
    }
  }
}
