import axios from "axios";
import { Result, Err } from "../utils/result";
import { type UserCredentials } from "../types/auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export class AuthApi {
  static async signIn(email: string, password: string): Promise<Result<UserCredentials, Err<never, string>>> {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signin`, {
        email,
        password,
        "returnSecureToken": true
      });

      return Result.ok(response.data);
    } catch (err) {
      // TODO Handle error
      console.error(err);

      return Result.err(new Err("Failed to sign in"));
    }
  }
}