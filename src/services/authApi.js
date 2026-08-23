const MOCK_USER = {
  id: 1,
  name: "Ravindran Logasanjeev",
  email: "rlogasanjeev@gmail.com",
  phone: "+91 98765 43210",
};

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export async function loginUser(credentials) {
  await delay();

  if (
    credentials.email === "rlogasanjeev@gmail.com" &&
    credentials.password === "123456"
  ) {
    document.cookie = "accessToken=abc123; Path=/; Max-Age=900";

    return { ...MOCK_USER };
  }

  throw new Error("Invalid email or password");
}

export async function getCurrentUser() {
  await delay();

  const hasToken = document.cookie
    .split("; ")
    .some((cookie) => cookie.startsWith("accessToken="));

  if (!hasToken) {
    throw new Error("Not authenticated");
  }

  return { ...MOCK_USER };
}

export function logoutUser() {
  document.cookie = "accessToken=; Path=/; Max-Age=0";
}
