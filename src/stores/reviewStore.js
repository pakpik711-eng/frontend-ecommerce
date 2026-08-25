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
