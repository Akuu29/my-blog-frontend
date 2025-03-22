import axios, { AxiosError } from "axios";
import Result from "../utils/result";
import type { ErrorResponse, ErrorStatusCodes } from "../types/error-response";
import type { Article, NewArticle, UpdateArticle } from "../types/article";
import type { Tag } from "../types/tag";
import type { PagedBody } from "../types/paged-body";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default class ArticleApi {
  static async create(article: NewArticle): Promise<Result<Article, ErrorResponse>> {
    try {
      const response = await axios.post(`${API_BASE_URL}/articles`, article);

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

  static async all(cursor: number | null = null, perPage: number | null = null): Promise<Result<PagedBody<Article>, ErrorResponse>> {
    try {
      const queryParams = cursor && perPage ?
        `cursor=${cursor}&per_page=${perPage}` :
        perPage ? `per_page=${perPage}` : "";
      const response = await axios.get(`${API_BASE_URL}/articles?${queryParams}`);

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

  static async find(article_id: number): Promise<Result<Article, ErrorResponse>> {
    try {
      const response = await axios.get(`${API_BASE_URL}/articles/${article_id}`);

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

  static async update(article_id: number, article: UpdateArticle): Promise<Result<Article, ErrorResponse>> {
    try {
      const response = await axios.patch(`${API_BASE_URL}/articles/${article_id}`, article);

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

  static async delete(article_id: number): Promise<Result<null, ErrorResponse>> {
    try {
      await axios.delete(`${API_BASE_URL}/articles/${article_id}`);

      return Result.ok(null);
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

  static async findByTag(tag_ids: Array<Tag>, cursor: number | null = null, perPage: number | null = null): Promise<Result<PagedBody<Article>, ErrorResponse>> {
    try {
      const queryTagIds = tag_ids.map((tag) => `ids=${tag.id}`).join("&");
      const queryParams = cursor && perPage ?
        `cursor=${cursor}&per_page=${perPage}&${queryTagIds}` :
        perPage ? `per_page=${perPage}&${queryTagIds}` :
          queryTagIds;
      const response = await axios.get(`${API_BASE_URL}/articles/by-tag?${queryParams}`);

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
