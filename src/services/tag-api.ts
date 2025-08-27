import { httpClient } from "./http-client";
import Result from "../utils/result";
import { requestSafely } from "../utils/request-safely";
import type { ErrorResponse } from "../types/error-response";
import type { Tag, NewTag } from "../types/tag";

export default class TagApi {
  static async create(new_tag: NewTag): Promise<Result<Tag, ErrorResponse>> {
    return requestSafely<Tag>(httpClient.post("/tags", new_tag));
  }

  static async all(): Promise<Result<Array<Tag>, ErrorResponse>> {
    return requestSafely<Array<Tag>>(httpClient.get("/tags"));
  }

  static async delete(tag_id: string): Promise<Result<null, ErrorResponse>> {
    return requestSafely<null>(httpClient.delete(`/tags/${tag_id}`));
  }

  static async findTagsByArticleId(articleId: string): Promise<Result<Array<Tag>, ErrorResponse>> {
    return requestSafely<Array<Tag>>(httpClient.get(`/tags/article/${articleId}`));
  }
}
