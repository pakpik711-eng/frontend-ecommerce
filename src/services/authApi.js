import { apiRequest } from "./api";


const AUTH_URL = "http://localhost:8080";

export function initiateGoogleAuth() {
  window.location.href = `${AUTH_URL}/oauth2/authorization/google`;
}

export function registerUser(credentials) {
  return apiRequest("/auth/register", {
    method: "POST",
    body: {
      email: credentials.email,
      password: credentials.password,
      role: "CUSTOMER",
    },
  });
}

export function loginUser(credentials) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: credentials,
  });
}

export function logoutUser() {
  return apiRequest("/auth/logout", {
    method: "POST",
  });
}


export function getCurrentUser() {
  return apiRequest("/auth/me");
}
