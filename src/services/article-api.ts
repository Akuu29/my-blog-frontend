import axios, { AxiosError } from "axios";
import qs from "qs";

import Result from "../utils/result";
import type { ErrorResponse, ErrorStatusCodes } from "../types/error-response";
import type { Article, NewArticle, UpdateArticle } from "../types/article";
import type { PagedBody } from "../types/paged-body";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type Paging = {
  cursor: number | null;
  perPage: number;
};

type ArticleFilter = {
  status: string;
  categoryId?: string;
};

type ArticlesByTagFilter = {
  tagIds: Array<string>;
};

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

  static async all(filter?: ArticleFilter, paging?: Paging): Promise<Result<PagedBody<Article>, ErrorResponse>> {
    try {
      const queryParams = qs.stringify({ ...paging, ...filter }, { skipNulls: true });
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

  static async find(article_id: string): Promise<Result<Article, ErrorResponse>> {
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

  static async update(articleId: string, article: UpdateArticle): Promise<Result<Article, ErrorResponse>> {
    try {
      const response = await axios.patch(`${API_BASE_URL}/articles/${articleId}`, article);

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

  static async attachTags(articleId: string, tagIds: Array<string>): Promise<Result<null, ErrorResponse>> {
    try {
      await axios.put(`${API_BASE_URL}/articles/${articleId}/tags`, tagIds);

      return Result.ok(null);
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

  static async delete(articleId: string): Promise<Result<null, ErrorResponse>> {
    try {
      await axios.delete(`${API_BASE_URL}/articles/${articleId}`);

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

  static async findByTag(filter: ArticlesByTagFilter, paging: Paging): Promise<Result<PagedBody<Article>, ErrorResponse>> {
    try {
      const queryParams = qs.stringify(
        { ...paging, ...filter },
        { skipNulls: true, arrayFormat: "brackets", encodeValuesOnly: true }
      );
      const response = await axios.get(`${API_BASE_URL}/articles/tags?${queryParams}`);

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
