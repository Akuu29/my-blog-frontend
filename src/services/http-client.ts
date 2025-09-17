import axios from "axios";

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 5000, // msec
});

// TODO: implement refresh access token
// httpClient.interceptors.response.use(
//   r => r,
//   async e => {
//     if (e.response?.status === 401) {
//       // refresh access token
//     }
//     return Promise.reject(e);
//   }
// );
