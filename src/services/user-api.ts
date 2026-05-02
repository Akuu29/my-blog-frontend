import { httpClient, type IHttpClient } from "./http-client";
import Result from "../utils/result";
import type { User, UserFilter } from "../types/user";
import type { ErrorResponse } from "../types/error-response";
import type { PagedBody } from "../types/paged-body";
import type { ApiCredentials } from "../types/token";
import type { Pagination } from "../types/pagination";

export class UserApi {
  constructor(private http: IHttpClient) { }

  async signIn(idToken: string): Promise<Result<ApiCredentials, ErrorResponse>> {
    return this.http.post(`/users/signin`, {}, {
      headers: { Authorization: `Bearer ${idToken}` },
    });
  }

  async all(filter?: UserFilter, pagination?: Pagination): Promise<Result<PagedBody<User>, ErrorResponse>> {
    return this.http.get(
      "/users",
      { params: { ...(pagination ?? {}), ...(filter ?? {}) } }
    );
  }

  async find(userId: string): Promise<Result<User, ErrorResponse>> {
    return this.http.get(`/users/${userId}`);
  }

  async update(userId: string, data: { name: string }): Promise<Result<User, ErrorResponse>> {
    return this.http.patch(`/users/${userId}`, data);
  }
}

export const userApi = new UserApi(httpClient);
