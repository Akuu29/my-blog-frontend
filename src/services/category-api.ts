import { httpClient } from "./http-client";
import Result from "../utils/result";
import { requestSafely } from "../utils/request-safely";
import type { ErrorResponse } from "../types/error-response";
import type { Category, NewCategory, UpdateCategory, CategoryFilter } from "../types/category";

export default class CategoryApi {
  static async all(categoryFilter?: CategoryFilter): Promise<Result<Array<Category>, ErrorResponse>> {
    return requestSafely<Array<Category>>(httpClient.get(
      "/categories",
      { params: { ...(categoryFilter ?? {}) } }
    ));
  }

  static async create(category: NewCategory): Promise<Result<Category, ErrorResponse>> {
    return requestSafely<Category>(httpClient.post("/categories", category));
  }

  static async update(categoryId: string, category: UpdateCategory): Promise<Result<Category, ErrorResponse>> {
    return requestSafely<Category>(httpClient.patch(`/categories/${categoryId}`, category));
  }

  static async delete(categoryId: string): Promise<Result<null, ErrorResponse>> {
    return requestSafely<null>(httpClient.delete(`/categories/${categoryId}`));
  }
}
