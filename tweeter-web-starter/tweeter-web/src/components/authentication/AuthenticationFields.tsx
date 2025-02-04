import { useState } from "react";

interface Props {
  passedInFunction: (event: React.KeyboardEvent<HTMLElement>) => void;
  setAlias: (value: string) => void;
  setPassword: (value: string) => void;
  alias: string;
  password: string;
}

const AuthenticationFields = (props: Props) => {
  return (
    <>
      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          size={50}
          id="aliasInput"
          placeholder="name@example.com"
          value={props.alias}
          onKeyDown={props.passedInFunction}
          onChange={(event) => props.setAlias(event.target.value)}
        />
        <label htmlFor="aliasInput">Alias</label>
      </div>
      <div className="form-floating">
        <input
          type="password"
          className="form-control"
          id="passwordInput"
          placeholder="Password"
          value={props.password}
          onKeyDown={props.passedInFunction}
          onChange={(event) => props.setPassword(event.target.value)}
        />
        <label htmlFor="passwordInput">Password</label>
      </div>
    </>
  );
};
export default AuthenticationFields;
