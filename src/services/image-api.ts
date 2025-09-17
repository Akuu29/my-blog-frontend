import { httpClient } from "./http-client";
import Result from "../utils/result";
import { requestSafely } from "../utils/request-safely";
import type { ErrorResponse } from "../types/error-response";
import type { Image } from "../types/image";

export default class ImageApi {
  static async upload(file: FormData): Promise<Result<Image, ErrorResponse>> {
    return requestSafely<Image>(httpClient.post("/images", file));
  }

  static async all(articleId: string): Promise<Result<Array<Image>, ErrorResponse>> {
    const filter = {
      articleId: articleId
    };
    return requestSafely<Array<Image>>(httpClient.get("/images", { params: filter }));
  }

  static async delete(imageId: string): Promise<Result<null, ErrorResponse>> {
    return requestSafely<null>(httpClient.delete(`/images/${imageId}`));
  }
}
