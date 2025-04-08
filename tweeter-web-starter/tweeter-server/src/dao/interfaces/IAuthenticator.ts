export interface IAuthenticator {
  authenticate(token: string): Promise<boolean>;
}
