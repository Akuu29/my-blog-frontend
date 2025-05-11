import axios, { AxiosError } from "axios";
import Result from "../utils/result";

import type { ErrorResponse, ErrorStatusCodes } from "../types/error-response";
import type { Image } from "../types/image";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default class ImageApi {
  static async upload(file: FormData): Promise<Result<Image, ErrorResponse>> {
    try {
      const response = await axios.post(`${API_BASE_URL}/images`, file);

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

  static async all(articleId: number): Promise<Result<Array<Image>, ErrorResponse>> {
    try {
      const filter = {
        articleId: articleId
      };
      const response = await axios.get(`${API_BASE_URL}/images`, { params: filter });

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

  static async delete(imageId: number): Promise<Result<null, ErrorResponse>> {
    try {
      await axios.delete(`${API_BASE_URL}/images/${imageId}`);

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
}
