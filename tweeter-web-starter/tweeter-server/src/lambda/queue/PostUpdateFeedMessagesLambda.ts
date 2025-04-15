import { StatusService } from '../../model/service/StatusService';
import { DyanmoDBFactory } from '../../dao/factories/DynamoDBFactory';

export const handler = async (event: any) => {
  console.log('PostUpdateFeedMessagesLambda was called');
  for (let i = 0; i < event.Records.length; ++i) {
    const startTimeMillis = new Date().getTime();
    const message = JSON.parse(event.Records[i].body);
    const followerAlias = message.userAlias;
    const token = message.token;
    const pageSize = message.pageSize;
    const lastItem = message.lastItem;

    const statusService = new StatusService(new DyanmoDBFactory());

    try {
      // Update the feed for this specific follower
      await statusService.updateFeeds(token, followerAlias, pageSize, lastItem);
    } catch (error) {
      console.error('Error updating feed:', error);
      throw error;
    }
    // we need this to make sure the lambda function is not called too fast
    const elapsedTime = new Date().getTime() - startTimeMillis;
    if (elapsedTime < 1000) {
      await new Promise<void>(resolve =>
        setTimeout(resolve, 1000 - elapsedTime)
      );
    }
  }
};
