import axios, { AxiosError } from "axios";
import Result from "../utils/result";
import type { ErrorResponse, ErrorStatusCodes } from "../types/error-response";
import type { Category, NewCategory, UpdateCategory, ArticlesByCategory, CategoryFilter } from "../types/category";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default class CategoryApi {
  static async all(categoryFilter: CategoryFilter): Promise<Result<Array<Category>, ErrorResponse>> {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`, {
        params: categoryFilter
      });

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

  static async create(category: NewCategory): Promise<Result<Category, ErrorResponse>> {
    try {
      const response = await axios.post(`${API_BASE_URL}/categories`, category);

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

  static async update(category_id: number, category: UpdateCategory): Promise<Result<Category, ErrorResponse>> {
    try {
      const response = await axios.patch(`${API_BASE_URL}/categories/${category_id}`, category);

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

  static async delete(category_id: number): Promise<Result<null, ErrorResponse>> {
    try {
      await axios.delete(`${API_BASE_URL}/categories/${category_id}`);

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

  static async find_articles_by_category(category_name: string): Promise<Result<Array<ArticlesByCategory>, ErrorResponse>> {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories/${category_name}/articles`);

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
