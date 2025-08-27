import type { AxiosResponse } from "axios";

import Result from "./result";
import { toErrorResponse } from "./api-error";
import type { ErrorResponse } from "../types/error-response";

export async function requestSafely<T>(
  p: Promise<AxiosResponse<T>>
): Promise<Result<T, ErrorResponse>> {
  try {
    const response = await p;

    return Result.ok(response.data);
  } catch (err) {
    return Result.err(toErrorResponse(err));
  }
}
