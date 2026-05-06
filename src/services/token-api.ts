import { httpClient, type IHttpClient } from "./http-client";
import Result from "../utils/result";
import type { ApiCredentials } from "../types/token";
import type { ErrorResponse } from "../types/error-response";

export class TokenApi {
  constructor(private http: IHttpClient) { }

  async refreshToken(): Promise<Result<ApiCredentials, ErrorResponse>> {
    return this.http.get(`/token/refresh`);
  }

  async resetRefreshToken(): Promise<Result<null, ErrorResponse>> {
    return this.http.get(`/token/reset`);
  }
}

export const tokenApi = new TokenApi(httpClient);
