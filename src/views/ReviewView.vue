<template>
  <div class="review-page-container">
    <div v-if="reviewStore.isLoading" class="loading-state">
      Loading product review details...
    </div>

    <div v-else-if="reviewStore.product" class="review-wrapper">
      <div class="product-header">
        <div class="product-info">
          <span class="product-title">{{ reviewStore.product.name }}</span>
          <img
            :src="reviewStore.product.thumbnail"
            :alt="reviewStore.product.name"
            class="product-thumb"
          />
        </div>
      </div>

      <div class="review-card">
        <div class="review-section">
          <h3>Rate this product</h3>
          <div class="star-rating-container">
            <div class="stars">
              <span
                v-for="star in 5"
                :key="star"
                class="star"
                :class="{ active: star <= (hoverRating || rating) }"
                @mouseenter="hoverRating = star"
                @mouseleave="hoverRating = 0"
                @click="rating = star"
              >
                ★
              </span>
            </div>
            <span v-if="ratingLabel" class="rating-label">
              {{ ratingLabel }}
            </span>
          </div>
        </div>

        <hr class="divider" />

        <div class="review-section">
          <h3>Review this product</h3>

          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label for="description">Description</label>
              <textarea
                id="description"
                v-model="description"
                rows="4"
                placeholder="Write your review here..."
                required
              ></textarea>
            </div>

            <div class="form-group">
              <label for="title">Title (optional)</label>
              <input
                id="title"
                v-model="title"
                type="text"
                placeholder="Summarize your experience..."
              />
            </div>

            <div class="form-actions">
              <button
                type="submit"
                class="submit-btn"
                :disabled="!isValid || reviewStore.isLoading"
              >
                {{ reviewStore.isLoading ? "SUBMITTING..." : "SUBMIT" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useReviewStore } from "@/stores/reviewStore";

const route = useRoute();
const router = useRouter();
const reviewStore = useReviewStore();

const rating = ref(0);
const hoverRating = ref(0);
const title = ref("");
const description = ref("");

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

const isValid = computed(
  () => rating.value > 0 && description.value.trim() !== "",
);

onMounted(async () => {
  const { p_id, v_id, m_id } = route.params;
  await reviewStore.loadReviewAndProduct(p_id, v_id, m_id);

  if (reviewStore.currentReview) {
    rating.value = reviewStore.currentReview.rating || 0;
    title.value = reviewStore.currentReview.title || "";
    description.value = reviewStore.currentReview.description || "";
  }
});

const handleSubmit = async () => {
  if (!isValid.value) return;

  const { p_id, v_id, m_id } = route.params;
  try {
    await reviewStore.saveReview({
      productId: p_id,
      variantId: v_id,
      merchantId: m_id,
      rating: rating.value,
      title: title.value,
      description: description.value,
    });
    alert("Review submitted successfully!");
    router.push("/profile");
  } catch (err) {
    alert(err.message || "Failed to submit review");
  }
};
</script>

<style scoped>
.review-page-container {
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.loading-state {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
}

.product-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0.75rem;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background-color: #ffffff;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
}

.product-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.product-thumb {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
}

.review-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 1.5rem;
}

.review-section h3 {
  font-size: 1.05rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 1rem;
}

.star-rating-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stars {
  display: flex;
  gap: 0.25rem;
}

.star {
  font-size: 1.75rem;
  color: #d1d5db;
  cursor: pointer;
  transition: color 0.15s ease;
  user-select: none;
}

.star.active {
  color: #f59e0b;
}

.rating-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #16a34a;
}

.divider {
  border: none;
  border-top: 1px solid #f3f4f6;
  margin: 1.5rem 0;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-bottom: 1.25rem;
}

label {
  font-size: 0.8rem;
  color: #6b7280;
}

textarea,
input[type="text"] {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 0.9rem;
  outline: none;
  box-sizing: border-box;
}

textarea:focus,
input[type="text"]:focus {
  border-color: #f97316;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.submit-btn {
  background-color: #fb641b;
  color: #ffffff;
  border: none;
  padding: 0.75rem 2.5rem;
  font-size: 0.9rem;
  font-weight: 700;
  border-radius: 2px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.submit-btn:hover {
  background-color: #e05510;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
