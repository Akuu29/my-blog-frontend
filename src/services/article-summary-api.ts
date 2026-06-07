import { httpClient, type IHttpClient } from "./http-client";
import Result from "../utils/result";
import type { ErrorResponse } from "../types/error-response";
import type { ArticleSummary, GenerateSummaryParams } from "../types/article-summary";

const ERROR_MESSAGES: Record<number, string> = {
  400: "Cannot generate summary: title or body is empty.",
  422: "The content could not be processed.",
  429: "Please wait a moment and try again.",
  502: "Failed to connect to external service. Please try again later.",
};

export function getSummaryErrorMessage(status: number): string {
  return ERROR_MESSAGES[status] ?? "An unexpected error occurred.";
}

export class ArticleSummaryApi {
  constructor(private http: IHttpClient) { }

  async get(articleId: string): Promise<Result<ArticleSummary, ErrorResponse>> {
    return this.http.get(`/articles/${articleId}/summary`);
  }

  async generate(articleId: string, params?: GenerateSummaryParams): Promise<Result<ArticleSummary, ErrorResponse>> {
    return this.http.post(`/articles/${articleId}/summary`, undefined, { params });
  }

  async delete(articleId: string): Promise<Result<null, ErrorResponse>> {
    return this.http.delete(`/articles/${articleId}/summary`);
  }
}

export const articleSummaryApi = new ArticleSummaryApi(httpClient);
