import { httpClient, type IHttpClient } from "./http-client";
import Result from "../utils/result";
import type { ErrorResponse } from "../types/error-response";

export class HelloWorldApi {
  constructor(private http: IHttpClient) { }

  async getHelloWorld(): Promise<Result<string, ErrorResponse>> {
    return this.http.get("/hello-world");
  }
}

export const helloWorldApi = new HelloWorldApi(httpClient);
