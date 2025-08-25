import axios from "axios";
import qs from "qs";

import Result from "../utils/result";
import { requestSafely } from "../utils/request-safely";
import type { User, UserFilter } from "../types/user";
import type { ErrorResponse } from "../types/error-response";
import type { PagedBody } from "../types/paged-body";
import type { ApiCredentials } from "../types/token";
import type { Pagination } from "../types/pagination";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default class UserApi {
  static async signIn(idToken: string): Promise<Result<ApiCredentials, ErrorResponse>> {
    return requestSafely<ApiCredentials>(axios.post(`${API_BASE_URL}/users/signin`, {}, {
      headers: {
        Authorization: `Bearer ${idToken}`
      },
      withCredentials: true,
    }));
  }

  static async all(filter: UserFilter, pagination?: Pagination): Promise<Result<PagedBody<User>, ErrorResponse>> {
    const queryParams = qs.stringify({ ...pagination, ...filter }, { skipNulls: true });
    return requestSafely<PagedBody<User>>(axios.get(`${API_BASE_URL}/users?${queryParams}`));
  }
}
