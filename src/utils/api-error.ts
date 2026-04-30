import type { ErrorResponse } from "../types/error-response";

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "HttpError";
  }
}

export function toErrorResponse(err: unknown): ErrorResponse {
  if (err instanceof HttpError) {
    return { status: err.status, message: err.message };
  }
  if (err instanceof DOMException && err.name === "AbortError") {
    return { status: 408, message: "Request timed out" };
  }
  return { status: 500, message: "Unknown error occurred" };
}
