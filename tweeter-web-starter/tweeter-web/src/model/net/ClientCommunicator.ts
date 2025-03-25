import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  LogoutRequest,
  LogoutResponse,
} from 'tweeter-shared';
import { AuthRequest } from 'tweeter-shared/dist/model/net/request/AuthRequest';
import { TweeterRequest } from 'tweeter-shared/dist/model/net/request/TweeterRequest';
import { TweeterResponse } from 'tweeter-shared/dist/model/net/response/TweeterResponse';

export class ClientCommunicator {
  private SERVER_URL: string;

  public constructor(SERVER_URL: string) {
    this.SERVER_URL = SERVER_URL;
  }

  public async doPost<
    REQ extends TweeterRequest | AuthRequest,
    RES extends
      | TweeterResponse
      | LoginResponse
      | RegisterResponse
      | LogoutResponse
  >(req: REQ | undefined, endpoint: string, headers?: Headers): Promise<RES> {
    if (!headers) {
      headers = new Headers();
    }

    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    console.log(`The request body is '${JSON.stringify(req)}'`);

    const url = this.getUrl(endpoint);
    const params = this.getParams(
      'POST',
      headers,
      req ? JSON.stringify(req) : req
    );

    console.log(`Fetching '${url}' with params '${JSON.stringify(params)}'`);

    try {
      const resp: Response = await fetch(url, params);

      if (resp.ok) {
        // Be careful with the return type here. resp.json() returns Promise<any> which means there is no type checking on response.
        const response: RES = await resp.json();
        return response;
      } else {
        const error = await resp.json();
        throw new Error(error.errorMessage);
      }
    } catch (error) {
      console.error(error);
      throw new Error(
        `Client communicator ${params.method} failed:\n${
          (error as Error).message
        }`
      );
    }
  }

  private getUrl(endpoint: string): string {
    return this.SERVER_URL + endpoint;
  }

  private getParams(
    method: string,
    headers?: Headers,
    body?: BodyInit
  ): RequestInit {
    const params: RequestInit = {
      method: method,
      mode: 'cors',
      credentials: 'include',
    };

    if (headers) {
      params.headers = headers;
    }

    if (body) {
      params.body = body;
    }

    return params;
  }
}
