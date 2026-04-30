import { match } from "ts-pattern";
import Result from "../utils/result";
import { HttpError, toErrorResponse } from "../utils/api-error";
import type { ErrorResponse } from "../types/error-response";

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
const TIMEOUT_MS = 5000;

type RequestOptions = {
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
  timeoutMs?: number;
};

export interface IHttpClient {
  get<T>(path: string, options?: RequestOptions): Promise<Result<T, ErrorResponse>>;
  post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<Result<T, ErrorResponse>>;
  patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<Result<T, ErrorResponse>>;
  put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<Result<T, ErrorResponse>>;
  delete<T>(path: string, options?: RequestOptions): Promise<Result<T, ErrorResponse>>;
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  options: RequestOptions = {}
): Promise<Result<T, ErrorResponse>> {
  const { params, headers = {}, credentials = "include", timeoutMs = TIMEOUT_MS } = options;

  let url = `${BASE_URL}${path}`;
  if (params) {
    const qs = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null) continue;
      if (Array.isArray(value)) {
        for (const item of value) {
          qs.append(`${key}[]`, String(item));
        }
      } else {
        qs.append(key, String(value));
      }
    }
    const qsStr = qs.toString();
    if (qsStr) url += `?${qsStr}`;
  }

  const isFormData = body instanceof FormData;
  const resolvedHeaders: Record<string, string> = {
    ...(body !== undefined && !isFormData ? { "Content-Type": "application/json" } : {}),
    ...headers,
  };
  const fetchOptions: RequestInit = {
    method,
    credentials,
    headers: resolvedHeaders,
    ...(body !== undefined ? { body: isFormData ? body : JSON.stringify(body) } : {}),
  };

  // controller.signal is passed to fetch() and remains active until clearTimeout fires
  // or timeout elapses — covering both header receipt and body consumption (res.json/res.text).
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, { ...fetchOptions, signal: controller.signal });

    if (!res.ok) {
      let message = res.statusText;
      try {
        const data = await res.json();
        if (data?.message) message = data.message;
      } catch {
        // ignore parse error
      }
      throw new HttpError(res.status, message);
    }

    const contentType = res.headers.get("Content-Type") ?? "";
    if (res.status === 204 || !contentType) {
      return Result.ok(null as T);
    }

    const mimeType = contentType.split(";")[0].trim();
    return await match(mimeType)
      .with("application/json", () => res.json().then(data => Result.ok<T, ErrorResponse>(data as T)))
      .with("text/plain", () => res.text().then(text => Result.ok<T, ErrorResponse>(text as T)))
      .otherwise(() => Promise.resolve(Result.err<T, ErrorResponse>({ status: 500, message: "Unexpected response format" })));
  } catch (err) {
    return Result.err(toErrorResponse(err));
  } finally {
    // Disarm the timeout after the entire operation (including body reads) completes.
    clearTimeout(timeoutId);
  }
}

export const httpClient: IHttpClient = {
  get<T>(path: string, options?: RequestOptions): Promise<Result<T, ErrorResponse>> {
    return request<T>("GET", path, undefined, options);
  },
  post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<Result<T, ErrorResponse>> {
    return request<T>("POST", path, body, options);
  },
  patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<Result<T, ErrorResponse>> {
    return request<T>("PATCH", path, body, options);
  },
  put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<Result<T, ErrorResponse>> {
    return request<T>("PUT", path, body, options);
  },
  delete<T>(path: string, options?: RequestOptions): Promise<Result<T, ErrorResponse>> {
    return request<T>("DELETE", path, undefined, options);
  },
};
