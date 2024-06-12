import axios from "axios";

export class HelloWorldApi {
  static async getHelloWorld(): Promise<string> {
    try {
      const response = await axios.get("http://0.0.0.0:3000/");
      return response.data;
    } catch (e) {
      console.log(e);
      return "Error";
    }
  }
}