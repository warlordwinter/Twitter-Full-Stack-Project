import { MemoryRouter } from 'react-router-dom';
import Login from '../../../../src/components/authentication/login/Login';
import { render, screen } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import {
  LoginView,
  LoginPresenter,
} from '../../../../src/presenters/AuthenticationPresenters/LoginPresenter';
import { instance, mock, verify } from 'ts-mockito';

library.add(fab);

describe('Login Component', () => {
  it('First Rendered, Sign in button should be disabled', () => {
    const { signInButton } = renderLoginAndGetElement('/');

    expect(signInButton).toBeDisabled();
  });
  it('The sign-in button is enabled when both the alias and password fields have text.', async () => {
    const { signInButton, aliasField, passwordField, user } =
      renderLoginAndGetElement('/');

    await user.type(aliasField, 'a');
    await user.type(passwordField, 'a');

    expect(signInButton).toBeEnabled();
  });
  it('The sign-in button is disabled when both the alias and password fields have text.', async () => {
    const { signInButton, aliasField, passwordField, user } =
      renderLoginAndGetElement('/');

    await user.type(aliasField, 'a');
    await user.type(passwordField, 'b');
    expect(signInButton).toBeEnabled();

    await user.clear(aliasField);
    expect(signInButton).toBeDisabled();

    await user.type(aliasField, 'a');
    await user.clear(passwordField);
    expect(signInButton).toBeDisabled();
  });

  // it('The presenters login method is called with correct parameters when the sign-in button is pressed.', async () => {
  //   const mockPresenter = mock<LoginPresenter>();
  //   const mockPresenterInstance = instance(mockPresenter);

  //   const originalUrl = 'http://someurl.com';
  //   const alias = 'fsakl;dfkjl;asd;kj';
  //   const password = 'jklasdf;jlkadsfj;';
  //   const rememberMe = false;
  //   const { signInButton, aliasField, passwordField, user } =
  //     renderLoginAndGetElement(originalUrl);

  //   await user.type(aliasField, alias);
  //   await user.type(passwordField, password);

  //   await user.click(signInButton);
  //   verify(
  //     mockPresenter.doLogin(alias, password, rememberMe, { originalUrl })
  //   ).once();
  // });
});

const renderLogin = (originalUrl: string, presenter?: LoginPresenter) => {
  return render(
    <MemoryRouter>
      <Login
        originalUrl={originalUrl}
        presenterGenerator={realPresenterGenerator}
      />
    </MemoryRouter>
  );
};

const realPresenterGenerator = (view: LoginView) => new LoginPresenter(view);

const renderLoginAndGetElement = (originalUrl: string) => {
  const user = userEvent.setup();

  renderLogin(originalUrl);

  const signInButton = screen.getByRole('button', { name: /Sign in/i });
  const aliasField = screen.getByLabelText('alias');
  const passwordField = screen.getByLabelText('password');

  return { signInButton, aliasField, passwordField, user };
};
