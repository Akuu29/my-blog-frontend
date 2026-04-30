import { httpClient, type IHttpClient } from "./http-client";
import Result from "../utils/result";
import type { ErrorResponse } from "../types/error-response";
import type { Tag, NewTag, TagFilter } from "../types/tag";
import type { PagedBody } from "../types/paged-body";
import type { Pagination } from "../types/pagination";

export class TagApi {
  constructor(private http: IHttpClient) { }

  async create(new_tag: NewTag): Promise<Result<Tag, ErrorResponse>> {
    return this.http.post("/tags", new_tag);
  }

  async all(filter?: TagFilter, pagination?: Pagination): Promise<Result<PagedBody<Tag>, ErrorResponse>> {
    return this.http.get(
      "/tags",
      { params: { ...(pagination ?? {}), ...(filter ?? {}) } }
    );
  }

  async delete(tag_id: string): Promise<Result<null, ErrorResponse>> {
    return this.http.delete(`/tags/${tag_id}`);
  }

  async findTagsByArticleId(articleId: string): Promise<Result<Array<Tag>, ErrorResponse>> {
    return this.http.get(`/tags/article/${articleId}`);
  }
}

export const tagApi = new TagApi(httpClient);
