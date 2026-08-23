const BASE_URL = "http://localhost:8080";

export async function apiRequest(url, options = {}) {
  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
   const data = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(data?.message || `API Error: ${response.status}`);
    error.status = response.status;
    error.response = data;
    throw error;
  }
  return data;
}
