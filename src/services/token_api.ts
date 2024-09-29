import axios from "axios";
import { Result, Err } from "../utils/result";
import { type ApiCredentials } from "../types/token";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export class TokenApi {
  static async verifyIdToken(idToken: string): Promise<Result<ApiCredentials, Err<never, string>>> {
    try {
      const response = await axios.get(`${API_BASE_URL}/token/verify`, {
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      });

      return Result.ok(response.data);
    } catch (err) {
      // TODO Handle error
      console.error(err);

      return Result.err(new Err("Failed to verify token"));
    }
  }
}