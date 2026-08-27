import { apiRequest } from "./api";

const AUTH_URL = "http://localhost:8084";
const AUTHERIZATION_URL = "http://10.17.48.83:8080";
// const AUTH_URL = "http://10.17.48.85:8084";

export function initiateGoogleAuth() {
  window.location.href = `${AUTH_URL}/oauth2/authorization/google`;
}

export function registerUser(credentials) {
  return apiRequest(AUTH_URL, "/auth/register", {
    method: "POST",
    body: {
      email: credentials.email,
      password: credentials.password,
      role: "CUSTOMER",
    },
  });
}

export function loginUser(credentials) {
  return apiRequest(AUTH_URL, "/auth/login", {
    method: "POST",
    body: credentials,
  });
}

export function logoutUser() {
  return apiRequest(AUTH_URL, "/auth/logout", {
    method: "POST",
  });
}

export function testAuth() {
  return apiRequest(AUTH_URL, "/test/user");
}
