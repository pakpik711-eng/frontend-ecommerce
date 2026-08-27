<template>
  <main class="review-page">
    <h1>Rate & Review</h1>

    <router-link v-if="product" :to="productLink" class="product-card">
      <img
        v-if="product.thumbnail"
        :src="product.thumbnail"
        :alt="product.name"
      />
      <div v-else class="product-thumbnail-placeholder">No Image</div>
      <div class="product-info">
        <h2>{{ product.name }}</h2>
      </div>
    </router-link>

    <div v-if="isLoading" class="status-msg">Loading your review...</div>

    <form v-else class="review-form" @submit.prevent="handleSubmit">
      <p v-if="error" class="error">{{ error }}</p>

      <div class="rating-field">
        <span class="field-label">Your Rating</span>
        <div class="stars" @mouseleave="hoverRating = 0">
          <button
            v-for="n in 5"
            :key="n"
            type="button"
            class="star-btn"
            :class="{ filled: n <= (hoverRating || rating) }"
            @mouseenter="hoverRating = n"
            @click="rating = n"
          >
            ★
          </button>
        </div>
        <span v-if="hoverRating || rating" class="rating-label">
          {{ ratingLabel }}
        </span>
      </div>

      <div class="text-field">
        <label for="reviewText">Your Review</label>
        <textarea
          id="reviewText"
          v-model="reviewText"
          rows="5"
          maxlength="2000"
          placeholder="Share your thoughts about this product..."
        ></textarea>
      </div>

      <p v-if="submitError" class="error">{{ submitError }}</p>

      <button
        type="submit"
        class="submit-btn"
        :disabled="!isValid || isSubmitting"
      >
        {{
          isSubmitting
            ? "Saving..."
            : currentReview
              ? "Update Review"
              : "Submit Review"
        }}
      </button>
    </form>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

import { useRoute, useRouter } from "vue-router";

import { reviewApi } from "@/services/reviewApi";

const route = useRoute();
const router = useRouter();



const currentReview = ref(null);

const isLoading = ref(false);
const isSubmitting = ref(false);

const error = ref("");
const submitError = ref("");

const rating = ref(0);
const hoverRating = ref(0);
const reviewText = ref("");



const productId = computed(() => route.params.p_id);

const variantId = computed(() => route.params.v_id);

const merchantId = computed(() => route.params.m_id);

const productLink = computed(
  () =>
    `/product/details/${productId.value}/${variantId.value}?m_id=${merchantId.value}`,
);


const product = computed(() => {
  if (!route.query.name) {
    return null;
  }

  return {
    name: route.query.name,
    thumbnail: route.query.thumbnail || null,
  };
});



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


const saveReview = (isUpdating) => {
  const payload = {
    rating: rating.value,
    reviewText: reviewText.value.trim(),
  };

  return isUpdating
    ? reviewApi.updateReview(merchantId.value, variantId.value, payload)
    : reviewApi.createReview(merchantId.value, variantId.value, payload);
};

const handleSubmit = async () => {
  if (!isValid.value || isSubmitting.value) {
    return;
  }

  submitError.value = "";
  isSubmitting.value = true;

 
  const isUpdating = currentReview.value !== null;

  try {
    let response;

    try {
      response = await saveReview(isUpdating);
    } catch (err) {
      
      if (!isUpdating && err.status === 409) {
        currentReview.value = await reviewApi.getReview(
          merchantId.value,
          variantId.value,
        );

        response = await saveReview(true);
      } else {
        throw err;
      }
    }

    const wasUpdate = currentReview.value !== null;

    currentReview.value = response;

    alert(
      wasUpdate
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

<style scoped>
.review-page {
  max-width: 640px;
  margin: 1.5rem auto 3rem;
  padding: 0 1.5rem;
}

.review-page h1 {
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--color-text-main);
  margin-bottom: 1.25rem;
}

.status-msg {
  color: var(--color-text-muted);
  padding: 1.5rem 0;
  text-align: center;
}

.error {
  background-color: var(--color-danger-light);
  color: var(--color-danger);
  border: 1px solid #fecaca;
  border-radius: var(--radius-md);
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  font-weight: 500;
  font-size: 0.9rem;
}

.product-card {
  display: flex;
  gap: 1rem;
  align-items: center;
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  padding: 1rem;
  margin-bottom: 1.5rem;
  text-decoration: none;
  color: inherit;
  transition: border-color 0.15s ease;
}

.product-card:hover {
  border-color: var(--color-primary);
}

.product-card img,
.product-thumbnail-placeholder {
  width: 72px;
  height: 72px;
  object-fit: contain;
  border-radius: var(--radius-md);
  background: var(--color-bg);
  flex-shrink: 0;
}

.product-thumbnail-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  color: var(--color-text-muted);
  text-align: center;
}

.product-info h2 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-main);
}

.review-form {
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
}

.rating-field {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.field-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text-main);
}

.stars {
  display: flex;
}

.star-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: var(--color-border);
  padding: 0 0.1rem;
  line-height: 1;
}

.star-btn.filled {
  color: #f59e0b;
}

.rating-label {
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.text-field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 1.25rem;
}

.text-field label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text-main);
}

.text-field textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  font-family: inherit;
  resize: vertical;
  box-sizing: border-box;
}

.submit-btn {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: var(--radius-pill);
  background: var(--color-primary);
  color: #ffffff;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
}

.submit-btn:hover:not(:disabled) {
  background: var(--color-primary-hover);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
