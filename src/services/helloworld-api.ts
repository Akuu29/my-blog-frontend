import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export class HelloWorldApi {
  static async getHelloWorld(): Promise<string> {
    try {
      const response = await axios.get(`${API_BASE_URL}/`,);
      return response.data;
    } catch (e) {
      return "Error";
    }
  }
}
