import PostStatus from '../../../src/components/postStatus/PostStatus';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { PostStatusPresenter } from '../../../src/presenters/PostStatusPresentersFolder/PostStatusPresenter';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

describe('PostStatus Component', () => {
  it('When first rendered the Post Status and Clear buttons are both disabled.', () => {
    const { postStatusButton, clearStatusButton } =
      renderPostStatusAndGetElement('/');

    expect(postStatusButton).toBeDisabled();
    expect(clearStatusButton).toBeDisabled();
  });

  it('Both buttons are enabled when the text field has text.', async () => {});
});

const renderPostStatus = (originalUrl: string) => {
  return render(
    <MemoryRouter>
      <PostStatus presenterGenerator={view => new PostStatusPresenter(view)} />
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
