import { DyanmoDBFactory } from '../../dao/factories/DynamoDBFactory';
import { StatusService } from '../../model/service/StatusService';

export const handler = async function (event: any) {
  console.log('UpdateFeedsLambda was called');
  for (let i = 0; i < event.Records.length; ++i) {
    const { body } = event.Records[i];
    // TODO: Add code to print message body to the log.
    // console.log(body);
    const message = JSON.parse(body);
    const statusService = new StatusService(new DyanmoDBFactory());

    try {
      // Update feeds for the batch of followers
      await statusService.processFeedJob(
        message.followerAliases,
        message.newStatus
      );
    } catch (error) {
      console.error('Error updating feeds:', error);
      throw error;
    }
  }
  return null;
};
