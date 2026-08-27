<script setup>
import { ref, computed, onMounted } from "vue";

import { useRoute, useRouter } from "vue-router";

import { reviewApi } from "@/services/reviewApi";

const route = useRoute();
const router = useRouter();

// ============================================================
// STATE
// ============================================================

const currentReview = ref(null);

const isLoading = ref(false);
const isSubmitting = ref(false);

const error = ref("");
const submitError = ref("");

const rating = ref(0);
const hoverRating = ref(0);
const reviewText = ref("");

// ============================================================
// ROUTE PARAMETERS
// ============================================================

const productId = computed(() => route.params.p_id);

const variantId = computed(() => route.params.v_id);

const merchantId = computed(() => route.params.m_id);

// ============================================================
// RATING
// ============================================================

const ratingLabels = {
  1: "Very Bad",
  2: "Bad",
  3: "Good",
  4: "Very Good",
  5: "Excellent",
};

const ratingLabel = computed(() => {
  const activeStar = hoverRating.value || rating.value;

  return ratingLabels[activeStar] || "";
});

const isValid = computed(() => {
  return (
    rating.value >= 1 && rating.value <= 5 && reviewText.value.trim() !== ""
  );
});

// ============================================================
// LOAD EXISTING REVIEW
// ============================================================

const loadReviewDetails = async () => {
  isLoading.value = true;
  error.value = "";

  try {
    const review = await reviewApi.getReview(merchantId.value, variantId.value);

    currentReview.value = review;

    if (review) {
      rating.value = review.rating || 0;

      reviewText.value = review.reviewText || "";
    }
  } catch (err) {
    /**
     * 404 means the user has not reviewed
     * this product yet.
     *
     * That's not an actual page error because
     * they can create a new review.
     */
    if (err.status === 404) {
      currentReview.value = null;
    } else {
      error.value = err.message || "Failed to load review";
    }
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadReviewDetails();
});

// ============================================================
// CREATE / UPDATE REVIEW
// ============================================================

const handleSubmit = async () => {
  if (!isValid.value || isSubmitting.value) {
    return;
  }

  submitError.value = "";
  isSubmitting.value = true;

  /**
   * Store this BEFORE making the request.
   * Otherwise currentReview will be populated
   * after creation and the success message
   * would incorrectly say "updated".
   */
  const isUpdating = currentReview.value !== null;

  try {
    let response;

    if (isUpdating) {
      // ======================================================
      // UPDATE EXISTING REVIEW
      // ======================================================

      response = await reviewApi.updateReview(
        merchantId.value,
        variantId.value,
        {
          rating: rating.value,
          reviewText: reviewText.value.trim(),
        },
      );
    } else {
      // ======================================================
      // CREATE NEW REVIEW
      // ======================================================

      response = await reviewApi.createReview(
        merchantId.value,
        variantId.value,
        {
          rating: rating.value,
          reviewText: reviewText.value.trim(),
        },
      );
    }

    currentReview.value = response;

    alert(
      isUpdating
        ? "Review updated successfully!"
        : "Review submitted successfully!",
    );

    await router.push("/profile?tab=orders");
  } catch (err) {
    submitError.value = err.message || "Failed to save review";
  } finally {
    isSubmitting.value = false;
  }
};
</script>
