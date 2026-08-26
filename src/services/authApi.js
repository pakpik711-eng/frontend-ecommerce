import { apiRequest } from "./api";

const AUTH_URL = "http://localhost:8084";
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

export async function testAuth() {
  try {
    await apiRequest(AUTH_URL, "/test/user");
    return true;
  } catch (err) {
    if (err.response?.status == 401) {
      console.log("Un authorized...");
      return false;
    }

    throw err;
  }
}
