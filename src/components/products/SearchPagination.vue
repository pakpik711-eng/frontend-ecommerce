<template>
  <div class="pagination">
    <button
      :disabled="safePage === 0"
      @click="$emit('page-change', safePage - 1)"
    >
      &#8592; Prev
    </button>
    <span>Page {{ safePage + 1 }} of {{ safeTotalPages }}</span>
    <button
      :disabled="safePage === safeTotalPages - 1"
      @click="$emit('page-change', safePage + 1)"
    >
      Next &#8594;
    </button>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },

  totalPages: {
    type: Number,
    required: true,
  },
});

defineEmits(["page-change"]);

const safePage = computed(() =>
  Number.isFinite(props.currentPage) ? props.currentPage : 0,
);

const safeTotalPages = computed(() =>
  Number.isFinite(props.totalPages) && props.totalPages > 0 ? props.totalPages : 1,
);
</script>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  margin: 32px 0 12px;
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.pagination button {
  padding: 8px 16px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  background: var(--color-surface);
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--color-text-main);
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease;
}

.pagination button:hover:not(:disabled) {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.pagination button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
</style>