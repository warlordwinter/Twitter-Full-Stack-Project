import { StatusService } from '../../model/service/StatusService';
import { DyanmoDBFactory } from '../../dao/factories/DynamoDBFactory';
import { StatusDto } from 'tweeter-shared';

export const handler = async (event: any) => {
  console.log(
    'PostUpdateFeedMessagesLambda was called with event:',
    JSON.stringify(event)
  );

  const statusService = new StatusService(new DyanmoDBFactory());

  try {
    for (const record of event.Records) {
      const startTimeMillis = new Date().getTime();
      console.log('Processing record:', record.messageId);

      const message = JSON.parse(record.body);
      console.log('Message body:', JSON.stringify(message));

      const { followerAliases, newStatus } = message;

      if (
        !followerAliases ||
        !Array.isArray(followerAliases) ||
        followerAliases.length === 0
      ) {
        console.error('Invalid followerAliases in message:', message);
        continue;
      }

      if (!newStatus) {
        console.error('Invalid newStatus in message:', message);
        continue;
      }

      try {
        // Batch update feeds for all followers in this message
        await statusService.batchPostFeed(followerAliases, newStatus);
        console.log(
          `Successfully updated feeds for ${followerAliases.length} followers`
        );
      } catch (error) {
        console.error('Error batch updating feeds:', error);
        // Continue processing other records even if one fails
        continue;
      }

      // Ensure minimum processing time of 1 second per record
      const elapsedTime = new Date().getTime() - startTimeMillis;
      if (elapsedTime < 1000) {
        await new Promise<void>(resolve =>
          setTimeout(resolve, 1000 - elapsedTime)
        );
      }
    }
  } catch (error) {
    console.error('Fatal error in PostUpdateFeedMessagesLambda:', error);
    throw error;
  }
};
