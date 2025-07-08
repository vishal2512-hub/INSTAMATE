// axios.js
import axios from "axios";

export const makeRequest = axios.create({
  baseURL: "https://instamate87.onrender.com", // or deployed one
  withCredentials: true,
});
