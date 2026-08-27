import { apiRequest } from "./api";
import { testAuth } from "./authApi";

const REVIEW_URL = "http://10.17.48.70:8082/api/reviews";

async function getUserId() {
  const response = await testAuth();

  if (!response || !response.user_id) {
    throw new Error("Unable to get authenticated user ID");
  }

  return response.user_id;
}

async function createReview(merchantId, variantId, reviewData) {
  const userId = await getUserId();

  return apiRequest(REVIEW_URL, `/${userId}/${merchantId}/${variantId}`, {
    method: "POST",
    body: {
      rating: reviewData.rating,
      reviewText: reviewData.reviewText,
    },
  });
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

  return apiRequest(REVIEW_URL, `/variant/${variantId}?${params.toString()}`);
}

async function getUserReviews(userId, page = 0, size = 10) {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
  });

  return apiRequest(REVIEW_URL, `/user/${userId}?${params.toString()}`);
}

async function getMyReviews(page = 0, size = 10) {
  const userId = await getUserId();

  return getUserReviews(userId, page, size);
}

async function getReview(merchantId, variantId) {
  const userId = await getUserId();

  return apiRequest(REVIEW_URL, `/${userId}/${merchantId}/${variantId}`);
}

async function updateReview(merchantId, variantId, reviewData) {
  const userId = await getUserId();

  return apiRequest(REVIEW_URL, `/${userId}/${merchantId}/${variantId}`, {
    method: "PUT",
    body: {
      rating: reviewData.rating,
      reviewText: reviewData.reviewText,
    },
  });
}

async function deleteReview(reviewId) {
  const userId = await getUserId();

  return apiRequest(
    REVIEW_URL,
    `/${reviewId}?userId=${encodeURIComponent(userId)}`,
    {
      method: "DELETE",
    },
  );
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
