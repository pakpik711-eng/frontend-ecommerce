import axios from "axios";
import router from "@/router";
import { useAuthStore } from "@/stores/authStore";


const GATEWAY_URL = "http://localhost:8080";


const AUTH_CHECK_PATHS = ["/auth/me", "/auth/login", "/auth/register"];

export function apiRequest(url, options = {}) {
  return axios
    .request({
      baseURL: GATEWAY_URL,

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
        const status = error.response.status;

        if (
          status === 401 &&
          !AUTH_CHECK_PATHS.some((path) => url.startsWith(path))
        ) {
          handleSessionExpired();
        }

        const apiError = new Error(
          error.response.data?.message || defaultMessageFor(status),
        );

        apiError.status = status;

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


function defaultMessageFor(status) {
  switch (status) {
    case 400:
      return "That request wasn't valid. Please check the details and try again.";
    case 401:
      return "You need to be logged in to do that.";
    case 403:
      return "You don't have permission to do that.";
    case 404:
      return "We couldn't find what you were looking for.";
    case 409:
      return "That couldn't be completed due to a conflict. Please try again.";
    case 422:
      return "Some of the details provided weren't valid.";
    case 500:
    case 502:
    case 503:
    case 504:
      return "Something went wrong on our end. Please try again in a moment.";
    default:
      return "Something went wrong. Please try again.";
  }
}


function handleSessionExpired() {
  const authStore = useAuthStore();

 
  if (!authStore.isAuthenticated) {
    return;
  }

  authStore.handleSessionExpired();

  const current = router.currentRoute.value;

  if (current.name === "Login" || current.name === "Signup") {
    return;
  }

  router.push({ name: "Login", query: { redirect: current.fullPath } });
}
