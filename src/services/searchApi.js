import { apiRequest } from "./api";

// const BASE_URL = "http://10.17.48.85:8085";
const BASE_URL = "http://10.17.48.83:8080";

export function searchProducts(query, page, size) {
  return apiRequest(
    BASE_URL,
    `/api/search/products?q=${encodeURIComponent(query)}&page=${page}&size=${size}`,
  );
}
