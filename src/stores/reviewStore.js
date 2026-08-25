import { defineStore } from "pinia";
import { ref } from "vue";
import { reviewApi } from "@/services/reviewApi";

export const useReviewStore = defineStore("review", () => {
  const currentReview = ref(null);
  const product = ref(null);
  const isLoading = ref(false);
  const error = ref(null);

  async function loadReviewAndProduct(productId, variantId, merchantId) {
    isLoading.value = true;
    error.value = null;
    try {
      const [existingReview, productDetails] = await Promise.all([
        reviewApi.getReview(productId, variantId, merchantId),
        reviewApi.getProductDetails(productId, variantId, merchantId),
      ]);
      currentReview.value = existingReview;
      product.value = productDetails;
    } catch (err) {
      error.value = err.message || "Failed to load review details";
    } finally {
      isLoading.value = false;
    }
  }

  async function saveReview(reviewData) {
    isLoading.value = true;
    error.value = null;
    try {
      const updated = await reviewApi.submitReview(reviewData);
      currentReview.value = updated;
    } catch (err) {
      error.value = err.message || "Failed to submit review";
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    currentReview,
    product,
    isLoading,
    error,
    loadReviewAndProduct,
    saveReview,
  };
});

// import { defineStore } from "pinia";
// import { ref } from "vue";

// import {
//   createReview,
//   getVariantReviews,
//   getUserReviews,
//   updateReview,
//   deleteReview,
// } from "@/services/reviewApi";

// export const useReviewStore = defineStore("review", () => {
//   const reviews = ref([]);

//   const currentReview = ref(null);

//   const totalCount = ref(0);

//   const averageRating = ref(0);

//   const isLoading = ref(false);

//   const error = ref(null);

//   async function fetchVariantReviews(variantId, merchantId = null) {
//     isLoading.value = true;
//     error.value = null;

//     try {
//       const response = await getVariantReviews(
//         variantId,
//         merchantId,
//       );

//       reviews.value = response.reviews || [];
//       totalCount.value = response.totalCount || 0;
//       averageRating.value = response.averageRating || 0;

//       return response;
//     } catch (err) {
//       error.value = err.message || "Failed to load reviews";
//       throw err;
//     } finally {
//       isLoading.value = false;
//     }
//   }

//   async function fetchUserReviews(userId) {
//     isLoading.value = true;
//     error.value = null;

//     try {
//       const response = await getUserReviews(userId);

//       reviews.value = response.reviews || [];
//       totalCount.value = response.totalCount || 0;
//       averageRating.value = response.averageRating || 0;

//       return response;
//     } catch (err) {
//       error.value = err.message || "Failed to load user reviews";
//       throw err;
//     } finally {
//       isLoading.value = false;
//     }
//   }

//   async function saveReview(reviewData) {
//     isLoading.value = true;
//     error.value = null;

//     try {
//       const createdReview = await createReview(reviewData);

//       currentReview.value = createdReview;

//       // Update local list if this review is already being displayed
//       reviews.value.push(createdReview);

//       totalCount.value += 1;

//       return createdReview;
//     } catch (err) {
//       error.value = err.message || "Failed to submit review";
//       throw err;
//     } finally {
//       isLoading.value = false;
//     }
//   }

//   async function editReview(reviewId, userId, reviewData) {
//     isLoading.value = true;
//     error.value = null;

//     try {
//       const updatedReview = await updateReview(
//         reviewId,
//         userId,
//         reviewData,
//       );

//       currentReview.value = updatedReview;

//       const index = reviews.value.findIndex(
//         (review) => review.reviewId === reviewId,
//       );

//       if (index !== -1) {
//         reviews.value[index] = updatedReview;
//       }

//       return updatedReview;
//     } catch (err) {
//       error.value = err.message || "Failed to update review";
//       throw err;
//     } finally {
//       isLoading.value = false;
//     }
//   }

//   async function removeReview(reviewId, userId) {
//     isLoading.value = true;
//     error.value = null;

//     try {
//       await deleteReview(reviewId, userId);

//       reviews.value = reviews.value.filter(
//         (review) => review.reviewId !== reviewId,
//       );

//       if (currentReview.value?.reviewId === reviewId) {
//         currentReview.value = null;
//       }

//       totalCount.value = Math.max(0, totalCount.value - 1);
//     } catch (err) {
//       error.value = err.message || "Failed to delete review";
//       throw err;
//     } finally {
//       isLoading.value = false;
//     }
//   }

//   function setCurrentReview(review) {
//     currentReview.value = review;
//   }

//   function clearReviews() {
//     reviews.value = [];
//     currentReview.value = null;
//     totalCount.value = 0;
//     averageRating.value = 0;
//     error.value = null;
//   }

//   return {
//     reviews,
//     currentReview,
//     totalCount,
//     averageRating,
//     isLoading,
//     error,

//     fetchVariantReviews,
//     fetchUserReviews,

//     saveReview,
//     editReview,
//     removeReview,

//     setCurrentReview,
//     clearReviews,
//   };
// });
