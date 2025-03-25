import {
  GetFeedRequest,
  GetFeedResponse,
  GetIsRequest,
  GetIsResponse,
  PagedUserItemRequest,
  PagedUserItemResponse,
  PostStatusRequest,
  PostStatusResponse,
  Status,
  User,
  UserDto,
} from 'tweeter-shared';
import { ClientCommunicator } from './ClientCommunicator';

export class ServerFacade {
  private SERVER_URL =
    'https://dq265h0evj.execute-api.us-west-2.amazonaws.com/prod';

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  public async getMoreFollowees(
    request: PagedUserItemRequest
  ): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(request, '/followee/list');

    // Convert the UserDto array returned by ClientCommunicator to a User array
    const items: User[] | null =
      response.success && response.items
        ? response.items.map(dto => User.fromDto(dto) as User)
        : null;

    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error(`No followees found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? 'Unknown error');
    }
  }

  public async getMoreFollowers(
    request: PagedUserItemRequest
  ): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(request, '/follower/list');

    // Convert the UserDto array returned by ClientCommunicator to a User array
    const items: User[] | null =
      response.success && response.items
        ? response.items.map(dto => User.fromDto(dto) as User)
        : null;

    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error(`No followees found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? 'Unknown error');
    }
  }

  public async getMoreFeed(
    request: GetFeedRequest
  ): Promise<[Status[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      GetFeedRequest,
      GetFeedResponse
    >(request, '/feed/list');

    const items: Status[] | null =
      response.success && response.statuses
        ? response.statuses.map(dto => Status.fromDto(dto) as Status)
        : null;

    if (response.success) {
      if (items == null) {
        throw new Error(`No feed items found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? 'Unknown error');
    }
  }

  public async getMoreStory(
    request: GetFeedRequest
  ): Promise<[Status[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      GetFeedRequest,
      GetFeedResponse
    >(request, '/story/list');

    const items: Status[] | null =
      response.success && response.statuses
        ? response.statuses.map(dto => Status.fromDto(dto) as Status)
        : null;

    if (response.success) {
      if (items == null) {
        throw new Error(`No story items found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? 'Unknown error');
    }
  }

  public async postStatus(request: PostStatusRequest): Promise<void> {
    const response = await this.clientCommunicator.doPost<
      PostStatusRequest,
      PostStatusResponse
    >(request, '/status/post');

    if (response.success) {
      console.log('Status posted successfully');
      return;
    } else {
      console.error(response);
      throw new Error(response.message ?? 'Unknown error');
    }
  }
}
