import axios from "axios";

import Result from "../utils/result";
import { requestSafely } from "../utils/request-safely";
import type { ErrorResponse } from "../types/error-response";
import type { Category, NewCategory, UpdateCategory, CategoryFilter } from "../types/category";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default class CategoryApi {
  static async all(categoryFilter: CategoryFilter): Promise<Result<Array<Category>, ErrorResponse>> {
    return requestSafely<Array<Category>>(axios.get(`${API_BASE_URL}/categories`, { params: categoryFilter }));
  }

  static async create(category: NewCategory): Promise<Result<Category, ErrorResponse>> {
    return requestSafely<Category>(axios.post(`${API_BASE_URL}/categories`, category));
  }

  static async update(categoryId: string, category: UpdateCategory): Promise<Result<Category, ErrorResponse>> {
    return requestSafely<Category>(axios.patch(`${API_BASE_URL}/categories/${categoryId}`, category));
  }

  static async delete(categoryId: string): Promise<Result<null, ErrorResponse>> {
    return requestSafely<null>(axios.delete(`${API_BASE_URL}/categories/${categoryId}`));
  }
}
