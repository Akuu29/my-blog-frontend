import { httpClient, type IHttpClient } from "./http-client";
import Result from "../utils/result";
import type { ErrorResponse } from "../types/error-response";
import type { Article, ArticleFilter, NewArticle, UpdateArticle, ArticlesByTagFilter } from "../types/article";
import type { PagedBody } from "../types/paged-body";
import type { Pagination } from "../types/pagination";

export class ArticleApi {
  constructor(private http: IHttpClient) { }

  async create(article: NewArticle): Promise<Result<Article, ErrorResponse>> {
    return this.http.post("/articles", article);
  }

  async all(filter?: ArticleFilter, pagination?: Pagination): Promise<Result<PagedBody<Article>, ErrorResponse>> {
    return this.http.get(
      "/articles",
      { params: { ...(pagination ?? {}), ...(filter ?? {}) } }
    );
  }

  async find(article_id: string): Promise<Result<Article, ErrorResponse>> {
    return this.http.get(`/articles/${article_id}`);
  }

  async update(articleId: string, article: UpdateArticle): Promise<Result<Article, ErrorResponse>> {
    return this.http.patch(`/articles/${articleId}`, article);
  }

  async attachTags(articleId: string, tagIds: Array<string>): Promise<Result<null, ErrorResponse>> {
    return this.http.put(`/articles/${articleId}/tags`, tagIds);
  }

  async delete(articleId: string): Promise<Result<null, ErrorResponse>> {
    return this.http.delete(`/articles/${articleId}`);
  }

  async findByTag(filter: ArticlesByTagFilter, pagination?: Pagination): Promise<Result<PagedBody<Article>, ErrorResponse>> {
    return this.http.get(
      "/articles/tags",
      { params: { ...(pagination ?? {}), ...filter } }
    );
  }
}

export const articleApi = new ArticleApi(httpClient);
