import { apiRequest } from "./api";

export function searchProducts(query, page, size) {
  return apiRequest(
    `/api/search/products?q=${encodeURIComponent(query)}&page=${page}&size=${size}`,
  );
}
