let mockReviews = [
  {
    productId: "prod-101",
    variantId: "var-201",
    merchantId: "merch-301",
    rating: 4,
    title: "Value-for-money",
    description: "Good sound quality and long battery life.",
  },
];

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export const reviewApi = {
  async getReview(productId, variantId, merchantId) {
    await delay();
    const review = mockReviews.find(
      (r) =>
        r.productId === productId &&
        r.variantId === variantId &&
        r.merchantId === merchantId,
    );
    return review ? { ...review } : null;
  },

  async submitReview(reviewData) {
    await delay();
    // u_id should be extracted from the JWT, since the review is protected.
    const index = mockReviews.findIndex(
      (r) =>
        r.productId === reviewData.productId &&
        r.variantId === reviewData.variantId &&
        r.merchantId === reviewData.merchantId,
    );

    if (index !== -1) {
      mockReviews[index] = { ...reviewData };
    } else {
      mockReviews.push({ ...reviewData });
    }
    return { ...reviewData };
  },

  async getProductDetails(productId, variantId, merchantId) {
    await delay();
    return {
      productId,
      variantId,
      merchantId,
      name: "ARISTOCRAT Carnival 55cm Cabin Luggage",
      thumbnail: "https://via.placeholder.com/48/2563eb/ffffff?text=Product",
    };
  },
};

import { apiRequest } from "./api";

const USER_ID = "U002";
const REVIEW_URL = "http://10.17.48.70:8082/api/reviews";

export function createReview(reviewData) {
  return apiRequest(REVIEW_URL, "", {
    method: "POST",
    body: reviewData,
  });
}

export function getVariantReviews(variantId, merchantId = null) {
  const queryParams = new URLSearchParams();

  if (merchantId) {
    queryParams.append("merchantId", merchantId);
  }

  const query = queryParams.toString();

  return apiRequest(
    REVIEW_URL,
    `/api/reviews/variant/${variantId}${query ? `?${query}` : ""}`,
  );
}

export function getUserReviews(userId) {
  return apiRequest(REVIEW_URL, `/api/reviews/user/${userId}`);
}

export function updateReview(reviewId, userId, reviewData) {
  return apiRequest(
    REVIEW_URL,
    `/api/reviews/${reviewId}?userId=${encodeURIComponent(userId)}`,
    {
      method: "PUT",
      body: reviewData,
    },
  );
}

export function deleteReview(reviewId, userId) {
  return apiRequest(
    REVIEW_URL,
    `/api/reviews/${reviewId}?userId=${encodeURIComponent(userId)}`,
    {
      method: "DELETE",
    },
  );
}
