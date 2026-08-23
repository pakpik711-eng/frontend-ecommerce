import { apiRequest } from "./api";

export function loginUser(credentials) {
  // apiRequest(`api/auth/login`, {...credentials});
  if (credentials.email === "abc@gmail.com" && credentials.password == 123456) {
    document.cookie = "accessToken=abc123; Path=/; Max-Age=900; ";
    return { email: credentials.email, name: "abc", phone: "+91 98765 43210" };
  }

  return null;
}
