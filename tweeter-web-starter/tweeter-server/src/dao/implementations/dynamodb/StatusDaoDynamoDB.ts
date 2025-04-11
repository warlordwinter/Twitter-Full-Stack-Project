import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import { IStatusDao } from '../../interfaces/IStatusDao';
import { StatusDto } from 'tweeter-shared';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

export class StatusDaoDynamoDB implements IStatusDao {
  private readonly dynamoClient;
  private readonly region: string = 'us-west-2';
  private readonly storyTable: string = 'story';

  constructor() {
    this.dynamoClient = DynamoDBDocumentClient.from(
      new DynamoDBClient({ region: this.region })
    );
  }

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

  async postStory(token: string, newStatus: StatusDto): Promise<void> {
    const params = {
      TableName: this.storyTable,
      Item: {
        sender_alias: newStatus.user.alias,
        post: newStatus.post,
      },
    };
    try {
      await this.dynamoClient.send(new PutCommand(params));
    } catch (error) {
      console.error('Error posting story:', error);
      throw error;
    }
  }

  async postFeed(token: string, newStatus: StatusDto): Promise<void> {
    const params = {
      TableName: this.storyTable,
      Item: {
        sender_alias: newStatus.user.alias,
        post: newStatus.post,
      },
    };
    try {
      await this.dynamoClient.send(new PutCommand(params));
    } catch (error) {
      console.error('Error posting feed:', error);
      throw error;
    }
  }
}
