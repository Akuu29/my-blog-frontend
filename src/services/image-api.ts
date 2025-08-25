import axios from "axios";

import Result from "../utils/result";
import { requestSafely } from "../utils/request-safely";
import type { ErrorResponse } from "../types/error-response";
import type { Image } from "../types/image";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default class ImageApi {
  static async upload(file: FormData): Promise<Result<Image, ErrorResponse>> {
    return requestSafely<Image>(axios.post(`${API_BASE_URL}/images`, file));
  }

  static async all(articleId: string): Promise<Result<Array<Image>, ErrorResponse>> {
    const filter = {
      articleId: articleId
    };
    return requestSafely<Array<Image>>(axios.get(`${API_BASE_URL}/images`, { params: filter }));
  }

  static async delete(imageId: string): Promise<Result<null, ErrorResponse>> {
    return requestSafely<null>(axios.delete(`${API_BASE_URL}/images/${imageId}`));
  }
}
