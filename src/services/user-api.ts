import axios, { AxiosError } from "axios";
import qs from "qs";

import Result from "../utils/result";
import type { User, UserFilter } from "../types/user";
import type { ErrorResponse, ErrorStatusCodes } from "../types/error-response";
import type { PagedBody } from "../types/paged-body";
import type { ApiCredentials } from "../types/token";
import type { Pagination } from "../types/pagination";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default class UserApi {
  static async signIn(idToken: string): Promise<Result<ApiCredentials, ErrorResponse>> {
    try {
      const response = await axios.post(`${API_BASE_URL}/users/signin`, {}, {
        headers: {
          Authorization: `Bearer ${idToken}`
        },
        withCredentials: true,
      });

      return Result.ok(response.data);
    } catch (err) {
      if (err instanceof AxiosError) {
        const errorResponse = {
          message: err.message,
          status: Number(err.status) as ErrorStatusCodes
        };

        return Result.err(errorResponse);
      }

      const errorResponse = {
        message: "Unknown error occurred",
        status: 500 as ErrorStatusCodes
      };

      return Result.err(errorResponse);
    }
  }

  static async all(filter: UserFilter, pagination?: Pagination): Promise<Result<PagedBody<User>, ErrorResponse>> {
    try {
      const queryParams = qs.stringify({ ...pagination, ...filter }, { skipNulls: true });
      const response = await axios.get(`${API_BASE_URL}/users?${queryParams}`);

      return Result.ok(response.data);
    } catch (err) {
      if (err instanceof AxiosError) {
        const errorResponse = {
          message: err.message,
          status: Number(err.status) as ErrorStatusCodes
        };

        return Result.err(errorResponse);
      }

      const errorResponse = {
        message: "Unknown error occurred",
        status: 500 as ErrorStatusCodes
      };

      return Result.err(errorResponse);
    }
  }
}
