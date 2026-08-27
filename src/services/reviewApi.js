import { apiRequest } from "./api";
import { getCurrentUserId } from "./session";

async function createReview(merchantId, variantId, reviewData) {
  const userId = getCurrentUserId();

  return apiRequest(`/api/reviews/${userId}/${merchantId}/${variantId}`, {
    method: "POST",
    body: {
      rating: reviewData.rating,
      reviewText: reviewData.reviewText,
    },
  }).then((response) => response.data);
}

async function getVariantReviews(
  variantId,
  merchantId = null,
  page = 0,
  size = 10,
) {
  const params = new URLSearchParams();

  if (merchantId) {
    params.append("merchantId", merchantId);
  }

  params.append("page", page);
  params.append("size", size);

  return apiRequest(
    `/api/reviews/variant/${variantId}?${params.toString()}`,
  ).then((response) => response.data);
}

async function getUserReviews(userId, page = 0, size = 10) {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
  });

  return apiRequest(`/api/reviews/user/${userId}?${params.toString()}`).then(
    (response) => response.data,
  );
}

async function getMyReviews(page = 0, size = 10) {
  const userId = getCurrentUserId();

  return getUserReviews(userId, page, size);
}

async function getReview(merchantId, variantId) {
  const userId = getCurrentUserId();

  return apiRequest(`/api/reviews/${userId}/${merchantId}/${variantId}`).then(
    (response) => response.data,
  );
}

async function updateReview(merchantId, variantId, reviewData) {
  const userId = getCurrentUserId();

  return apiRequest(`/api/reviews/${userId}/${merchantId}/${variantId}`, {
    method: "PUT",
    body: {
      rating: reviewData.rating,
      reviewText: reviewData.reviewText,
    },
  }).then((response) => response.data);
}

async function deleteReview(reviewId) {
  const userId = getCurrentUserId();

  return apiRequest(
    `/api/reviews/${reviewId}?userId=${encodeURIComponent(userId)}`,
    {
      method: "DELETE",
    },
  ).then((response) => response.data);
}

export const reviewApi = {
  createReview,
  getVariantReviews,
  getUserReviews,
  getMyReviews,
  getReview,
  updateReview,
  deleteReview,
};
