import { apiRequest } from "./api";

const BASE_URL = "http://10.17.48.85:8085";

export function getProducts(page, size) {
  return apiRequest(
    BASE_URL,
    `/api/search/home?page=${page}&size=${size}`,
    {
      method: "GET",
    }
  );
}

export function getProductDetail(productId) {
  return apiRequest(
    BASE_URL,
    `/api/search/products/${productId}`,
    {
      method: "GET",
    }
  );
}

export function getProductVariant(productId, attributes) {
  const params = new URLSearchParams(attributes);

  return apiRequest(
    BASE_URL,
    `/api/search/products/${productId}/variant?${params.toString()}`,
    {
      method: "GET",
    }
  );
}