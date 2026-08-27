import axios from "axios";

export function apiRequest(BASE_URL, url, options = {}) {
  return axios
    .request({
      baseURL: BASE_URL,

      url,

      method: options.method || "GET",

      data: options.body,

      params: options.params,

      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },

      withCredentials: true,
    })
    .then((response) => response.data)

    .catch((error) => {
      if (error.response) {
        const apiError = new Error(
          error.response.data?.message || `API Error: ${error.response.status}`,
        );

        apiError.status = error.response.status;

        apiError.response = error.response.data;

        return Promise.reject(apiError);
      }

      if (error.request) {
        const apiError = new Error(
          "Unable to reach the server. Please check your connection.",
        );

        apiError.request = error.request;

        return Promise.reject(apiError);
      }

      return Promise.reject(error);
    });
}
