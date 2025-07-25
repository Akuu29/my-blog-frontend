import axios, { AxiosError } from "axios";
import Result from "../utils/result";
import type { ApiCredentials } from "../types/token";
import type { ErrorResponse, ErrorStatusCodes } from "../types/error-response";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default class TokenApi {
  static async verifyIdToken(idToken: string): Promise<Result<ApiCredentials, ErrorResponse>> {
    try {
      const response = await axios.get(`${API_BASE_URL}/token/verify`, {
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

  static async refreshToken(): Promise<Result<ApiCredentials, ErrorResponse>> {
    try {
      const response = await axios.get(`${API_BASE_URL}/token/refresh`, {
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

  static async resetRefreshToken(): Promise<Result<null, ErrorResponse>> {
    try {
      const response = await axios.get(`${API_BASE_URL}/token/reset`, {
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
