import axios from "axios";
import Result from "../utils/result";
import { type ApiCredentials } from "../types/token";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default class TokenApi {
  static async verifyIdToken(): Promise<Result<ApiCredentials, string>> {
    try {
      // const response = await axios.get(`${API_BASE_URL}/token/verify`, {
      //   headers: {
      //     Authorization: `Bearer ${idToken}`
      //   }
      // });

      const response = await axios.get(`${API_BASE_URL}/token/verify`);

      return Result.ok(response.data);
    } catch (err) {
      // TODO Handle error
      console.error(err);

      return Result.err("Failed to verify token");
    }
  }
}
