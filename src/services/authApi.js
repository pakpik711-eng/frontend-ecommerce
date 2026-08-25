import { apiRequest } from "./api";

const AUTH_URL = "http://localhost:8084";

export function initiateGoogleAuth() {
  window.location.href = `${AUTH_URL}/oauth2/authorization/google`;
}

export async function registerUser(credentials) {
  return await apiRequest(AUTH_URL, "/auth/register", {
    method: "POST",
    body: {
      email: credentials.email,
      password: credentials.password,
      role: "USER",
    },
  });
}

export async function loginUser(credentials) {
  return await apiRequest(AUTH_URL, "/auth/login", {
    method: "POST",
    body: credentials,
  });
}

export async function logoutUser() {
  await apiRequest(AUTH_URL, "/auth/logout", {
    method: "POST",
  });
}

export async function testAuth() {
  const result = await apiRequest(AUTH_URL, "/test/user");

  console.log(result);
}
