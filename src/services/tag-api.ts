import axios from "axios";

import Result from "../utils/result";
import { requestSafely } from "../utils/request-safely";
import type { ErrorResponse } from "../types/error-response";
import type { Tag, NewTag } from "../types/tag";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default class TagApi {
  static async create(new_tag: NewTag): Promise<Result<Tag, ErrorResponse>> {
    return requestSafely<Tag>(axios.post(`${API_BASE_URL}/tags`, new_tag));
  }

  static async all(): Promise<Result<Array<Tag>, ErrorResponse>> {
    return requestSafely<Array<Tag>>(axios.get(`${API_BASE_URL}/tags`));
  }

  static async delete(tag_id: string): Promise<Result<null, ErrorResponse>> {
    return requestSafely<null>(axios.delete(`${API_BASE_URL}/tags/${tag_id}`));
  }

  static async findTagsByArticleId(articleId: string): Promise<Result<Array<Tag>, ErrorResponse>> {
    return requestSafely<Array<Tag>>(axios.get(`${API_BASE_URL}/tags/article/${articleId}`));
  }
}
