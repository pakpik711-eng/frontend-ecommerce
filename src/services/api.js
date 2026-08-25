import axios from "axios";
import axios from "axios";

export async function apiRequest(BASE_URL, url, options = {}) {
  const apiClient = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
export async function apiRequest(BASE_URL, url, options = {}) {
  const apiClient = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

  try {
    const response = await apiClient({
      url,
      method: options.method || "GET",
      data: options.body,
      headers: options.headers,
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      const apiError = new Error(
        error.response.data?.message ||
          `API Error: ${error.response.status}`
      );

      apiError.status = error.response.status;
      apiError.response = error.response.data;

      throw apiError;
    }


  try {
    const response = await apiClient({
      url,
      method: options.method || "GET",
      data: options.body,
      headers: options.headers,
      ...options,
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      const apiError = new Error(
        error.response.data?.message || `API Error: ${error.response.status}`,
      );
      apiError.status = error.response.status;
      apiError.response = error.response.data;
      throw apiError;
    }
    throw error;
  }
}