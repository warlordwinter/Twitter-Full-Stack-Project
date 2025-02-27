import {
  PostStatusPresenter,
  PostStatusView,
} from '../../src/presenters/PostStatusPresentersFolder/PostStatusPresenter';

import { StatusService } from '../../src/model/service/StatusService';
import { AuthToken, Status, User } from 'tweeter-shared';
import { capture, instance, mock, verify, when } from 'ts-mockito';

describe('PostStatusPresenter', () => {
  let mockPostStatusView: PostStatusView;
  let postStatusPresenter: PostStatusPresenter;
  let mockPostService: StatusService;
  let clickEvent: React.MouseEvent;
  const authToken = new AuthToken('token', Date.now());

  beforeEach(() => {
    mockPostStatusView = mock<PostStatusView>();
    const mockPostStatusViewInstance = instance(mockPostStatusView);

    mockPostService = mock<StatusService>();
    const mockPostStatusServiceInstance = instance(mockPostService);

    postStatusPresenter = new PostStatusPresenter(mockPostStatusViewInstance);
    postStatusPresenter.postStatusService = mockPostStatusServiceInstance;

    clickEvent = mock<React.MouseEvent>();
  });

  it('The presenter tells the view to display a posting status message.', async () => {
    await postStatusPresenter.submitPost(clickEvent);
    verify(
      mockPostStatusView.displayInfoMessage('Posting status...', 0)
    ).once();
  });
});

//   it('The presenter calls postStatus on the post status service with the correct status string and auth token.', async () => {
//     when(mockPostStatusView.post).thenReturn('new status');
//     await postStatusPresenter.submitPost(clickEvent);

//     verify(mockPostService.postStatus(authToken, updatedStatus)).once();
//   });
