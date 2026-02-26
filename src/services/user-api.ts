import { httpClient } from "./http-client";
import Result from "../utils/result";
import { requestSafely } from "../utils/request-safely";
import type { User, UserFilter } from "../types/user";
import type { ErrorResponse } from "../types/error-response";
import type { PagedBody } from "../types/paged-body";
import type { ApiCredentials } from "../types/token";
import type { Pagination } from "../types/pagination";

export default class UserApi {
  static async signIn(idToken: string): Promise<Result<ApiCredentials, ErrorResponse>> {
    return requestSafely<ApiCredentials>(httpClient.post(`/users/signin`, {}, {
      headers: {
        Authorization: `Bearer ${idToken}`
      },
      withCredentials: true,
    }));
  }

  static async all(filter?: UserFilter, pagination?: Pagination): Promise<Result<PagedBody<User>, ErrorResponse>> {
    return requestSafely<PagedBody<User>>(httpClient.get(
      "/users",
      { params: { ...(pagination ?? {}), ...(filter ?? {}) } }
    ));
  }

  static async find(userId: string): Promise<Result<User, ErrorResponse>> {
    return requestSafely<User>(httpClient.get(`/users/${userId}`));
  }

  static async update(userId: string, data: { name: string }): Promise<Result<User, ErrorResponse>> {
    return requestSafely<User>(httpClient.patch(`/users/${userId}`, data));
  }
}
