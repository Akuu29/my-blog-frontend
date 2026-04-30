import { httpClient, type IHttpClient } from "./http-client";
import Result from "../utils/result";
import type { ErrorResponse } from "../types/error-response";
import type { Image } from "../types/image";

const IMAGE_UPLOAD_TIMEOUT_MS = 60_000;

export class ImageApi {
  constructor(private http: IHttpClient) { }

  async upload(file: FormData): Promise<Result<Image, ErrorResponse>> {
    return this.http.post("/images", file, { timeoutMs: IMAGE_UPLOAD_TIMEOUT_MS });
  }

  async all(articleId: string): Promise<Result<Array<Image>, ErrorResponse>> {
    return this.http.get("/images", { params: { articleId } });
  }

  async delete(imageId: string): Promise<Result<null, ErrorResponse>> {
    return this.http.delete(`/images/${imageId}`);
  }
}

export const imageApi = new ImageApi(httpClient);
