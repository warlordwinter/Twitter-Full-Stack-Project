import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { IAuthenticator } from '../../interfaces/IAuthenticator';

export class DynamoDBAuthenticator implements IAuthenticator {
  private readonly dynamoClient;
  private readonly authTable: string;
  private readonly region: string = 'us-west-2';

  constructor() {
    this.dynamoClient = DynamoDBDocumentClient.from(
      new DynamoDBClient({ region: this.region })
    );
    this.authTable = process.env.AUTH_TABLE || 'authtoken';
  }

  async authenticate(token: string): Promise<boolean> {
    try {
      const params = {
        TableName: this.authTable,
        Key: { token },
      };
      const result = await this.dynamoClient.send(new GetCommand(params));
      return result.Item !== undefined;
    } catch (error) {
      console.error('Error during authentication:', error);
      // Depending on policy, you might want to return false or re-throw
      return false;
    }
  }
}
