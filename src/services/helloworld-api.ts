import axios from "axios";

import Result from "../utils/result";
import { requestSafely } from "../utils/request-safely";
import type { ErrorResponse } from "../types/error-response";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export class HelloWorldApi {
  static async getHelloWorld(): Promise<Result<string, ErrorResponse>> {
    return requestSafely<string>(axios.get(`${API_BASE_URL}/`));
  }
}
