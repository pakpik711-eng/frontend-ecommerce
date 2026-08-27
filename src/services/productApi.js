import { apiRequest } from "./api";

export function getProducts(page, size) {
  return apiRequest(`/api/search/home?page=${page}&size=${size}`, {
    method: "GET",
  });
}

export function getProductDetail(productId) {
  return apiRequest(`/api/search/products/${productId}`, {
    method: "GET",
  });
}

export function getProductVariant(productId, attributes) {
  const params = new URLSearchParams(attributes);

  return apiRequest(
    `/api/search/products/${productId}/variant?${params.toString()}`,
    {
      method: "GET",
    },
  );
}


export function getProductDetailsForCart(productId, variantId) {
  return apiRequest(`/api/search/products/${productId}/variants/${variantId}`, {
    method: "GET",
  });
}
