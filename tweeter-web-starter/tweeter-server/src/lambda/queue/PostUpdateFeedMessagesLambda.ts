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
      console.log('Processing record:', record.messageId);

      const newStatus = JSON.parse(record.body) as StatusDto;
      console.log('New status:', JSON.stringify(newStatus));

      try {
        await statusService.processNewStatus(newStatus);
      } catch (error) {
        console.error('Error processing new status:', error);
        // Continue processing other records even if one fails
        continue;
      }
    }
  } catch (error) {
    console.error('Fatal error in PostUpdateFeedMessagesLambda:', error);
    throw error;
  }
};
