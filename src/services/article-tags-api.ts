import axios, { AxiosError } from "axios";
import Result from "../utils/result";
import type { ErrorResponse, ErrorStatusCodes } from "../types/error-response";
import type { ArticleTag } from "../types/article-tag";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default class ArticleTagsApi {
  static async attachTags(articleId: number, tagIds: Array<number>): Promise<Result<Array<ArticleTag>, ErrorResponse>> {
    try {
      const articleAttachTags = {
        articleId,
        tagIds
      };
      const response = await axios.post(`${API_BASE_URL}/article-tags`, articleAttachTags);

      return Result.ok(response.data);
    } catch (err) {
      if (err instanceof AxiosError) {
        const errorResponse = {
          message: err.message,
          status: Number(err.status) as ErrorStatusCodes
        };

        return Result.err((errorResponse));
      }

      const errorResponse = {
        message: "Unknown error occurred",
        status: 500 as ErrorStatusCodes
      };

      return Result.err(errorResponse);
    }
  }
}
