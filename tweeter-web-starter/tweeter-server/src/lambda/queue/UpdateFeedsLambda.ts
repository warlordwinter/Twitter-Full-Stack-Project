export const handler = async function (event: any) {
  for (let i = 0; i < event.Records.length; ++i) {
    const { body } = event.Records[i];
    // TODO: Add code to print message body to the log.
  }
  return null;
};
