import axios from "axios";

import Result from "../utils/result";
import { requestSafely } from "../utils/request-safely";
import type { ApiCredentials } from "../types/token";
import type { ErrorResponse } from "../types/error-response";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default class TokenApi {
  static async refreshToken(): Promise<Result<ApiCredentials, ErrorResponse>> {
    return requestSafely<ApiCredentials>(axios.get(`${API_BASE_URL}/token/refresh`, {
      withCredentials: true,
    }));
  }

  static async resetRefreshToken(): Promise<Result<null, ErrorResponse>> {
    return requestSafely<null>(axios.get(`${API_BASE_URL}/token/reset`, {
      withCredentials: true,
    }));
  }
}
