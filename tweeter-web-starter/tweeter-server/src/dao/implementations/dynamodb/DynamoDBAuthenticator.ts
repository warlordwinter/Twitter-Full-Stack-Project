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
    this.authTable = 'authtoken';
  }

  async lookup(token: string): Promise<string> {
    const result = await this.dynamoClient.send(
      new GetCommand({
        TableName: this.authTable,
        Key: { token },
      })
    );

    if (!result.Item?.alias) {
      throw new Error('Token not found');
    }

    return result.Item.alias;
  }

  async authenticate(token: string): Promise<boolean> {
    try {
      console.log('Authenticating token:', token);
      const params = {
        TableName: this.authTable,
        Key: { token },
      };
      const result = await this.dynamoClient.send(new GetCommand(params));
      console.log('Authentication result:', result.Item !== undefined);
      return result.Item !== undefined;
    } catch (error) {
      console.error('Error during authentication:', error);
      return false;
    }
  }
}
