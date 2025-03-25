import { RegisterRequest } from 'tweeter-shared/dist/model/net/request/RegisterRequest';
import { ServerFacade } from '../../src/model/net/ServerFacade';
import { TweeterRequest } from 'tweeter-shared/dist/model/net/request/TweeterRequest';

// Add fetch polyfill for tests
import 'whatwg-fetch';
import { PagedUserItemRequest } from 'tweeter-shared/dist/model/net/request/PagedUserItemRequest';
import { GetCountRequest } from 'tweeter-shared/dist/model/net/request/GetCountRequest';
import { GetFeedRequest } from 'tweeter-shared/dist/model/net/request/GetFeedRequest';
import { StatusService } from '../../src/model/service/StatusService';

describe('ServerFacade', () => {
  let serverFacade: ServerFacade;
  let statusService: StatusService;

  beforeEach(() => {
    serverFacade = new ServerFacade();
    statusService = new StatusService();
  });

  it('Register', async () => {
    const request: RegisterRequest & TweeterRequest = {
      firstName: 'we',
      lastName: 'we',
      alias: 'f@jwt.com',
      password: 'franchisee',
      imageFileExtension: 'png',
      userImageBytes: new Uint8Array(),
      token: '',
    };

    const response = await serverFacade.register(request);
    expect(response).toBeDefined();
    expect(response?.success).toBe(true);
  });

  it('getFollowers', async () => {
    const request: PagedUserItemRequest & TweeterRequest = {
      userAlias: 'f@jwt.com',
      pageSize: 10,
      lastItem: null,
      token: '',
    };

    const response = await serverFacade.getMoreFollowers(request);
    expect(response).toBeDefined();
    expect(response[0]).toBeDefined();
    expect(response[1]).toBeDefined();
  });

  it('getFollowees', async () => {
    const request: GetCountRequest & TweeterRequest = {
      user: {
        firstName: 'we',
        lastName: 'we',
        alias: 'f@jwt.com',
        imageUrl: 'https://example.com/image.png',
      },
      token: '',
    };

    const response = await serverFacade.getFolloweeCount(request);
    expect(response).toBeDefined();
    expect(response).toBeGreaterThanOrEqual(0);
  });

  it('integration test', async () => {
    const userAlias = 'f@jwt.com';
    const pageSize = 10;
    const lastItem = null;
    const token = '';

    const response = await statusService.loadMoreFeed(
      token,
      userAlias,
      pageSize,
      lastItem
    );
    expect(response).toBeDefined();
    expect(response[0]).toBeDefined();
    expect(response[1]).toBeDefined();
  });
});
