import axios, { AxiosError } from "axios";

import Result from "../utils/result";
import type { ErrorResponse, ErrorStatusCodes } from "../types/error-response";
import type { ApiCredentials } from "../types/token";

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
}
