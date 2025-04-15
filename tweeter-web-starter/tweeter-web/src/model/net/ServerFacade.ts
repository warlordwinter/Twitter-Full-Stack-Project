import {
  FollowRequest,
  FollowResponse,
  GetCountRequest,
  GetCountResponse,
  GetFeedRequest,
  GetFeedResponse,
  GetIsRequest,
  GetIsResponse,
  GetUserRequest,
  GetUserResponse,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  LogoutResponse,
  PagedUserItemRequest,
  PagedUserItemResponse,
  PostStatusRequest,
  PostStatusResponse,
  RegisterRequest,
  RegisterResponse,
  Status,
  UnfollowRequest,
  User,
  UserDto,
} from 'tweeter-shared';
import { ClientCommunicator } from './ClientCommunicator';
import { TweeterRequest } from 'tweeter-shared/dist/model/net/request/TweeterRequest';

export class ServerFacade {
  private SERVER_URL =
    'https://3gp9vu1txe.execute-api.us-west-2.amazonaws.com/prod';

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
    >(request, '/followers/list');

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

  public async postStatus(
    request: PostStatusRequest
  ): Promise<PostStatusResponse> {
    const response = await this.clientCommunicator.doPost<
      PostStatusRequest,
      PostStatusResponse
    >(request, '/status/post');

    if (response.success) {
      console.log('Status posted successfully');
      return response;
    } else {
      console.error(response);
      throw new Error(response.message ?? 'Unknown error');
    }
  }

  public async getIsFollowerStatus(request: GetIsRequest): Promise<boolean> {
    const response = await this.clientCommunicator.doPost<
      GetIsRequest,
      GetIsResponse
    >(request, '/followers/status');

    if (response.success) {
      return response.isFollower;
    } else {
      console.error(response);
      throw new Error(response.message ?? 'Unknown error');
    }
  }

  public async getFolloweeCount(request: GetCountRequest): Promise<number> {
    const response = await this.clientCommunicator.doPost<
      GetCountRequest,
      GetCountResponse
    >(request, '/followee/count');
    if (response.success) {
      return response.value;
    } else {
      console.error(response);
      throw new Error(response.message ?? 'Unknown error');
    }
  }

  public async getFollowerCount(request: GetCountRequest): Promise<number> {
    const response = await this.clientCommunicator.doPost<
      GetCountRequest,
      GetCountResponse
    >(request, '/followers/count');
    if (response.success) {
      return response.value;
    } else {
      console.error(response);
      throw new Error(response.message ?? 'Unknown error');
    }
  }

  public async getUser(request: GetUserRequest): Promise<UserDto | null> {
    const response = await this.clientCommunicator.doPost<
      GetUserRequest,
      GetUserResponse
    >(request, '/user');
    if (response.success) {
      return response.user;
    } else {
      console.error(response);
      throw new Error(response.message ?? 'Unknown error');
    }
  }

  public async login(
    request: LoginRequest & TweeterRequest
  ): Promise<LoginResponse | null> {
    const response = await this.clientCommunicator.doPost<
      LoginRequest & TweeterRequest,
      LoginResponse
    >(request, '/login');
    if (response.success) {
      return response;
    } else {
      console.error(response);
      throw new Error(response.message ?? 'Unknown error');
    }
  }

  public async register(
    request: RegisterRequest & TweeterRequest
  ): Promise<RegisterResponse | null> {
    const response = await this.clientCommunicator.doPost<
      RegisterRequest & TweeterRequest,
      RegisterResponse
    >(request, '/register');
    if (response.success) {
      return response;
    } else {
      console.error(response);
      throw new Error(response.message ?? 'Unknown error');
    }
  }

  public async logout(request: LogoutRequest & TweeterRequest): Promise<void> {
    const response = await this.clientCommunicator.doPost<
      LogoutRequest & TweeterRequest,
      LogoutResponse
    >(request, '/logout');
    if (response.success) {
      return;
    } else {
      console.error(response);
      throw new Error(response.message ?? 'Unknown error');
    }
  }

  public async follow(request: FollowRequest): Promise<void> {
    try {
      console.log('Sending follow request:', JSON.stringify(request));
      const response = await this.clientCommunicator.doPost<
        FollowRequest,
        FollowResponse
      >(request, '/follow');

      if (response.success) {
        return;
      } else {
        console.error('Follow response error:', response);
        throw new Error(response.message ?? 'Unknown error');
      }
    } catch (error) {
      console.error('Error in follow request:', error);
      throw new Error(`Failed to follow user: ${(error as Error).message}`);
    }
  }
  public async unfollow(request: UnfollowRequest): Promise<void> {
    const response = await this.clientCommunicator.doPost<
      UnfollowRequest,
      FollowResponse
    >(request, '/unfollow');
    if (response.success) {
      return;
    } else {
      console.error(response);
      throw new Error(response.message ?? 'Unknown error');
    }
  }
}
