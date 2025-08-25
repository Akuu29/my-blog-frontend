import axios from "axios";
import qs from "qs";

import Result from "../utils/result";
import { requestSafely } from "../utils/request-safely";
import type { ErrorResponse } from "../types/error-response";
import type { Article, ArticleFilter, NewArticle, UpdateArticle, ArticlesByTagFilter } from "../types/article";
import type { PagedBody } from "../types/paged-body";
import type { Pagination } from "../types/pagination";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default class ArticleApi {
  static async create(article: NewArticle): Promise<Result<Article, ErrorResponse>> {
    return requestSafely(axios.post(`${API_BASE_URL}/articles`, article));
  }

  static async all(filter?: ArticleFilter, pagination?: Pagination): Promise<Result<PagedBody<Article>, ErrorResponse>> {
    const queryParams = qs.stringify({ ...pagination, ...filter }, { skipNulls: true });
    return requestSafely(axios.get(`${API_BASE_URL}/articles?${queryParams}`));
  }

  static async find(article_id: string): Promise<Result<Article, ErrorResponse>> {
    return requestSafely(axios.get(`${API_BASE_URL}/articles/${article_id}`));
  }

  static async update(articleId: string, article: UpdateArticle): Promise<Result<Article, ErrorResponse>> {
    return requestSafely(axios.patch(`${API_BASE_URL}/articles/${articleId}`, article));
  }

  static async attachTags(articleId: string, tagIds: Array<string>): Promise<Result<null, ErrorResponse>> {
    return requestSafely(axios.put(`${API_BASE_URL}/articles/${articleId}/tags`, tagIds));
  }

  static async delete(articleId: string): Promise<Result<null, ErrorResponse>> {
    return requestSafely(axios.delete(`${API_BASE_URL}/articles/${articleId}`));
  }

  static async findByTag(filter: ArticlesByTagFilter, pagination?: Pagination): Promise<Result<PagedBody<Article>, ErrorResponse>> {
    const queryParams = qs.stringify(
      { ...pagination, ...filter },
      { skipNulls: true, arrayFormat: "brackets", encodeValuesOnly: true }
    );

    return requestSafely(axios.get(`${API_BASE_URL}/articles/tags?${queryParams}`));
  }
}
