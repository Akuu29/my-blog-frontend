import { httpClient, type IHttpClient } from "./http-client";
import Result from "../utils/result";
import type { ErrorResponse } from "../types/error-response";
import type { Category, NewCategory, UpdateCategory, CategoryFilter } from "../types/category";
import type { Pagination } from "../types/pagination";
import type { PagedBody } from "../types/paged-body";

export class CategoryApi {
  constructor(private http: IHttpClient) { }

  async all(categoryFilter?: CategoryFilter, pagination?: Pagination): Promise<Result<PagedBody<Category>, ErrorResponse>> {
    return this.http.get(
      "/categories",
      { params: { ...(pagination ?? {}), ...(categoryFilter ?? {}) } }
    );
  }

  async create(category: NewCategory): Promise<Result<Category, ErrorResponse>> {
    return this.http.post("/categories", category);
  }

  async update(categoryId: string, category: UpdateCategory): Promise<Result<Category, ErrorResponse>> {
    return this.http.patch(`/categories/${categoryId}`, category);
  }

  async delete(categoryId: string): Promise<Result<null, ErrorResponse>> {
    return this.http.delete(`/categories/${categoryId}`);
  }
}

export const categoryApi = new CategoryApi(httpClient);
