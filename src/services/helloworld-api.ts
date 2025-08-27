import { httpClient } from "./http-client";
import Result from "../utils/result";
import { requestSafely } from "../utils/request-safely";
import type { ErrorResponse } from "../types/error-response";

export class HelloWorldApi {
  static async getHelloWorld(): Promise<Result<string, ErrorResponse>> {
    return requestSafely<string>(httpClient.get("/"));
  }
}
