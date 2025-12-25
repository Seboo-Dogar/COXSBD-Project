import axios, { AxiosInstance } from "axios";
import Cookies from "js-cookie";
import { BASE_API_URL } from "./config";

export default function axiosConfig(): AxiosInstance {
  const token = Cookies.get("accessToken");
  console.log("🔐 Auth Token:", token ? "Present" : "Missing");
  const instance = axios.create({
    baseURL: BASE_API_URL,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
  });

  // Add request interceptor for debugging
  instance.interceptors.request.use(
    (config) => {
      console.log("🚀 Axios Request:");
      console.log("Base URL:", config.baseURL);
      console.log("URL:", config.url);
      console.log("Full URL:", `${config.baseURL}${config.url}`);
      console.log("Method:", config.method);
      console.log("Headers:", config.headers);
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  return instance;
}

import { AxiosError } from "axios";

export function handleAxiosError(error: unknown) {
  console.log(error);
  if (error instanceof AxiosError) {
    if (error.response) {
      console.error("Request failed with status:", error.response.status);
      console.error("Error data:", error.response.data);
      return error.response.data?.message || "An unexpected error occurred";
    } else if (error.request) {
      console.error("No response received:", error.request);
      return "No response received from server";
    }
  }
  console.error("Error:", error);
  return "An unexpected error occurred";
}
