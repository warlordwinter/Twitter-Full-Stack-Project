import PostStatus from '../../../src/components/postStatus/PostStatus';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { PostStatusPresenter } from '../../../src/presenters/PostStatusPresentersFolder/PostStatusPresenter';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { anything, instance, mock, verify, when } from 'ts-mockito';
import { AuthToken } from 'tweeter-shared';

let mockPresenter: PostStatusPresenter;
let mockPresenterInstance: PostStatusPresenter;
beforeEach(() => {
  mockPresenter = mock(PostStatusPresenter);
  mockPresenterInstance = instance(mockPresenter);
});

describe('PostStatus Component', () => {
  it('When first rendered the Post Status and Clear buttons are both disabled.', () => {
    when(mockPresenter.checkButtonStatus()).thenReturn(true);
    const { postStatusButton, clearStatusButton } =
      renderPostStatusAndGetElement('/');

    expect(postStatusButton).toBeDisabled();
    expect(clearStatusButton).toBeDisabled();
  });

  it('Both buttons are enabled when the text field has text.', async () => {
    when(mockPresenter.checkButtonStatus()).thenReturn(false);
    const { postStatusButton, postStatusTextArea, clearStatusButton, user } =
      renderPostStatusAndGetElement('/');

    await user.type(postStatusTextArea, 'a');
    expect(postStatusButton).toBeEnabled();
    expect(clearStatusButton).toBeEnabled();
  });

  it('Both buttons are enabled when the text field has text and disabled when cleared.', async () => {
    when(mockPresenter.checkButtonStatus()).thenReturn(false);
    const { postStatusButton, postStatusTextArea, clearStatusButton, user } =
      renderPostStatusAndGetElement('/');

    await user.type(postStatusTextArea, 'a');
    expect(postStatusButton).toBeEnabled();
    expect(clearStatusButton).toBeEnabled();

    when(mockPresenter.checkButtonStatus()).thenReturn(true);
    await user.clear(postStatusTextArea);
    expect(postStatusButton).toBeDisabled();
    expect(clearStatusButton).toBeDisabled();
  });

  // it('The presenters postStatus method is called with correct parameters when the Post Status button is pressed.', async () => {
  //   when(mockPresenter.checkButtonStatus()).thenReturn(false);
  //   const { postStatusButton, postStatusTextArea, clearStatusButton, user } =
  //     renderPostStatusAndGetElement('/');

  //   await user.type(postStatusTextArea, 'a');
  //   expect(postStatusButton).toBeEnabled();
  //   expect(clearStatusButton).toBeEnabled();

  //   when(mockPresenter.submitPost(anything())).thenResolve();
  //   await user.click(postStatusButton);

  //   verify(mockPresenter.submitPost(anything())).once();
  // });
});

const renderPostStatus = (originalUrl: string) => {
  return render(
    <MemoryRouter>
      <PostStatus presenterGenerator={() => mockPresenterInstance} />
    </MemoryRouter>
  );
};

const renderPostStatusAndGetElement = (originalUrl: string) => {
  const user = userEvent.setup();
  renderPostStatus(originalUrl);

  const postStatusButton = screen.getByLabelText('PostStatusButton');
  const postStatusTextArea = screen.getByLabelText('textarea');
  const clearStatusButton = screen.getByLabelText('ClearStatusButton');

  return { postStatusButton, postStatusTextArea, clearStatusButton, user };
};
