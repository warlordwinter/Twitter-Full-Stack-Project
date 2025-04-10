export interface IAuthenticator {
  authenticate(token: string): Promise<boolean>;
  lookup(token: string): Promise<string>;
}
