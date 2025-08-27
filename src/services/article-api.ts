import { httpClient } from "./http-client";
import Result from "../utils/result";
import { requestSafely } from "../utils/request-safely";
import type { ErrorResponse } from "../types/error-response";
import type { Article, ArticleFilter, NewArticle, UpdateArticle, ArticlesByTagFilter } from "../types/article";
import type { PagedBody } from "../types/paged-body";
import type { Pagination } from "../types/pagination";

export default class ArticleApi {
  static async create(article: NewArticle): Promise<Result<Article, ErrorResponse>> {
    return requestSafely<Article>(httpClient.post("/articles", article));
  }

  static async all(filter?: ArticleFilter, pagination?: Pagination): Promise<Result<PagedBody<Article>, ErrorResponse>> {
    return requestSafely<PagedBody<Article>>(httpClient.get(
      "/articles",
      { params: { ...(pagination ?? {}), ...(filter ?? {}) } }
    ));
  }

  static async find(article_id: string): Promise<Result<Article, ErrorResponse>> {
    return requestSafely<Article>(httpClient.get(`/articles/${article_id}`));
  }

  static async update(articleId: string, article: UpdateArticle): Promise<Result<Article, ErrorResponse>> {
    return requestSafely<Article>(httpClient.patch(`/articles/${articleId}`, article));
  }

  static async attachTags(articleId: string, tagIds: Array<string>): Promise<Result<null, ErrorResponse>> {
    return requestSafely<null>(httpClient.put(`/articles/${articleId}/tags`, tagIds));
  }

  static async delete(articleId: string): Promise<Result<null, ErrorResponse>> {
    return requestSafely<null>(httpClient.delete(`/articles/${articleId}`));
  }

  static async findByTag(filter: ArticlesByTagFilter, pagination?: Pagination): Promise<Result<PagedBody<Article>, ErrorResponse>> {
    return requestSafely<PagedBody<Article>>(httpClient.get(
      "/articles/tags",
      { params: { ...(pagination ?? {}), ...filter } }
    ));
  }
}
