import axios from "axios";

export const makeRequest = axios.create({
  baseURL: "https://vishal2512-hub.github.io",
  withCredentials: true, // 🔥 This allows sending cookies
});
