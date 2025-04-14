import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { StatusDto } from 'tweeter-shared/src/model/dto/StatusDto';

export class SqsService {
  private sqsClient: SQSClient;

  constructor() {
    this.sqsClient = new SQSClient();
  }
  public async sendMessage(): Promise<void> {
    const sqs_url = '*** PUT YOUR QUEUE URL HERE ***';
    const messageBody = '*** PUT YOUR MESSAGE BODY HERE ***';

    const params = {
      DelaySeconds: 10,
      MessageBody: messageBody,
      QueueUrl: sqs_url,
    };

    try {
      const data = await this.sqsClient.send(new SendMessageCommand(params));
      console.log('Success, message sent. MessageID:', data.MessageId);
    } catch (err) {
      throw err;
    }
  }

  public async updateFeeds(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<void> {
    const sqs_url = '*** PUT YOUR QUEUE URL HERE ***';
    const messageBody = '*** PUT YOUR MESSAGE BODY HERE ***';

    const params = {
      DelaySeconds: 10,
      MessageBody: messageBody,
      QueueUrl: sqs_url,
    };

    try {
      const data = await this.sqsClient.send(new SendMessageCommand(params));
      console.log('Success, message sent. MessageID:', data.MessageId);
    } catch (err) {
      throw err;
    }
  }
}
