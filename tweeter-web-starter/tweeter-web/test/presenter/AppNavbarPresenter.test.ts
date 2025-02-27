import { AuthToken } from 'tweeter-shared';
import { AppNavbarPresenter } from '../../src/presenters/AuthenticationPresenters/AppNavbarPresenter';
import { AppNavbarView } from '../../src/presenters/AuthenticationPresenters/AppNavbarPresenter';
import {
  mock,
  instance,
  verify,
  spy,
  when,
  capture,
  anything,
} from 'ts-mockito';
import { AuthenticationService } from '../../src/model/service/AuthenticationService';

describe('AppNavbarPresenter', () => {
  let mockAppNavbarView: AppNavbarView;
  let appNavbarPresenter: AppNavbarPresenter;
  let mockAuthService: AuthenticationService;
  
  const authToken = new AuthToken('token', Date.now());

  beforeEach(() => {
    mockAppNavbarView = mock<AppNavbarView>();
    const mockAppNavbarPresenterViewInstance = instance(mockAppNavbarView);

    const appNavbarPresenterSpy = spy(
      new AppNavbarPresenter(mockAppNavbarPresenterViewInstance)
    );

    appNavbarPresenter = instance(appNavbarPresenterSpy);

    mockAuthService = mock<AuthenticationService>();
    const mockAuthServiceInstance = instance(mockAuthService);

    when(appNavbarPresenterSpy._service).thenReturn(mockAuthServiceInstance);
  });

  it('The presenter tells the view to display a logging out message.', async () => {
    await appNavbarPresenter.logOut(authToken);
    verify(mockAppNavbarView.displayInfoMessage('Logging Out...', 0)).once();
  });

  it('The presenter calls logout on the user service with the correct auth token.', async () => {
    await appNavbarPresenter.logOut(authToken);
    verify(mockAuthService.logout(authToken)).once();
    // let [captureAuthToken] = capture(mockAuthService.logout).last();
    // expect(captureAuthToken).toEqual(authToken);
  });
  it('When the logout is successful, the presenter tells the view to clear the last info message and clear the user info.', async () => {
    await appNavbarPresenter.logOut(authToken);

    verify(mockAppNavbarView.clearLastInfoMessage()).once();
    verify(mockAppNavbarView.clearUserInfo()).once();
    verify(mockAppNavbarView.navigate('/login')).once();
    verify(mockAppNavbarView.displayErrorMessage(anything())).never();
  });
  it('When the logout is not successful, the presenter tells the view to display an error message and does not tell it to clear the last info message or clear the user info.', async () => {
    when(mockAuthService.logout(authToken)).thenThrow(
      new Error('an error occurred')
    );

    await appNavbarPresenter.logOut(authToken);

    let [captured] = capture(mockAppNavbarView.displayErrorMessage).last();
    // expect(captured).toContain('Failed to log user out because of exception: an error occurred');
    console.log(captured);

    verify(
      mockAppNavbarView.displayErrorMessage(
        'Failed to log user out because of exception: an error occurred'
      )
    ).once();
    verify(mockAppNavbarView.clearLastInfoMessage()).never();
    verify(mockAppNavbarView.clearUserInfo()).never();
    verify(mockAppNavbarView.navigate('/login')).never();
  });
});

//stoped at 37:40
