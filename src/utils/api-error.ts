import axios from "axios";

import type { ErrorResponse } from "../types/error-response";

export function toErrorResponse(err: unknown): ErrorResponse {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status as number;
    const message = err.response?.data?.message ?? err.message;

    return {
      status,
      message
    };
  }

  return {
    message: "Unknown error occurred",
    status: 500
  };
}
