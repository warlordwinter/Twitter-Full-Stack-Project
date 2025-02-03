import { useState } from "react";

interface Props {
  passedInFunction: (event: React.KeyboardEvent<HTMLElement>) => void;
}

const AuthenticationFields = (props: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  return (
    <>
      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          size={50}
          id="aliasInput"
          placeholder="name@example.com"
          onKeyDown={props.passedInFunction}
          onChange={(event) => setAlias(event.target.value)}
        />
        <label htmlFor="aliasInput">Alias</label>
      </div>
      <div className="form-floating">
        <input
          type="password"
          className="form-control"
          id="passwordInput"
          placeholder="Password"
          onKeyDown={props.passedInFunction}
          onChange={(event) => setPassword(event.target.value)}
        />
        <label htmlFor="passwordInput">Password</label>
      </div>
    </>
  );
};
export default AuthenticationFields;
