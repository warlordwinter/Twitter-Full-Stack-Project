import 'whatwg-fetch';

import {
  GetFeedRequest,
  LoginRequest,
  PostStatusRequest,
} from 'tweeter-shared';
import { ServerFacade } from '../../src/model/net/ServerFacade';
import { TweeterRequest } from 'tweeter-shared/src/model/net/request/TweeterRequest';

describe('Integration Tests', () => {
  let serverFacade: ServerFacade;
  let randomNumber: number;

  beforeEach(() => {
    serverFacade = new ServerFacade();
    randomNumber = Math.floor(Math.random() * 1000000);
  });

  describe('Login', () => {
    it('should login successfully', async () => {
      //login a user
      const loginRequest: LoginRequest & TweeterRequest = {
        alias: 't',
        password: 't',
        token: '',
      };
      const loginResponse = await serverFacade.login(loginRequest);
      expect(loginResponse).toEqual({
        success: true,
        message: null,
        authToken: expect.any(String),
        user: {
          firstName: 't',
          lastName: 't',
          alias: 't',
          imageUrl:
            'https://wiley-tweeter-image-storage.s3.us-west-2.amazonaws.com/image/twebp',
        },
      });

      if (!loginResponse) {
        throw new Error('Login response is null');
      }

      //post a status
      const postRequest: PostStatusRequest & TweeterRequest = {
        token: loginResponse.authToken,
        newStatus: {
          user: {
            firstName: 't',
            lastName: 't',
            alias: 't',
            imageUrl:
              'https://wiley-tweeter-image-storage.s3.us-west-2.amazonaws.com/image/twebp',
          },
          post: `Hello, Test World! ${randomNumber}`,
          timestamp: 0,
        },
      };
      //verify the status was displayed

      const postResponse = await serverFacade.postStatus(postRequest);
      console.log(postResponse);
      expect(postResponse).toEqual({
        success: true,
        message: null,
      });

      //get the status
      const getStoryRequest: GetFeedRequest & TweeterRequest = {
        token: loginResponse.authToken,
        userAlias: 't',
        pageSize: 10,
        lastItem: null,
      };
      const [statuses, hasMore] = await serverFacade.getMoreStory(
        getStoryRequest
      );

      // Verify the status was posted and appears in the story
      const expectedPost = `Hello, Test World! ${randomNumber}`;
      const foundStatus = statuses.find(status => status.post === expectedPost);
      expect(foundStatus).toBeDefined();
      expect(foundStatus?.post).toBe(expectedPost);
      expect(foundStatus?.user.alias).toBe('t');
      expect(foundStatus?.user.firstName).toBe('t');
      expect(foundStatus?.user.lastName).toBe('t');
      expect(foundStatus?.user.imageUrl).toBe(
        'https://wiley-tweeter-image-storage.s3.us-west-2.amazonaws.com/image/twebp'
      );
    }, 180000); // 3 minutes timeout
  });
});
