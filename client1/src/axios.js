import axios from "axios";

export const makeRequest = axios.create({
  baseURL: "http://localhost:8801/api",
  withCredentials: true, // 🔥 This allows sending cookies
});
