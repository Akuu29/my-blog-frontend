import { httpClient } from "./http-client";
import Result from "../utils/result";
import { requestSafely } from "../utils/request-safely";
import type { ApiCredentials } from "../types/token";
import type { ErrorResponse } from "../types/error-response";

export default class TokenApi {
  static async refreshToken(): Promise<Result<ApiCredentials, ErrorResponse>> {
    return requestSafely<ApiCredentials>(httpClient.get(`/token/refresh`, {
      withCredentials: true,
    }));
  }

  static async resetRefreshToken(): Promise<Result<null, ErrorResponse>> {
    return requestSafely<null>(httpClient.get(`/token/reset`, {
      withCredentials: true,
    }));
  }
}
