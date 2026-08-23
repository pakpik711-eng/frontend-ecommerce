<template>
  <div class="pagination">
    <button
      :disabled="currentPage === 0"
      @click="$emit('page-change', currentPage - 1)"
    >
      &#8592; Prev
    </button>
    <span>Page {{ currentPage +1 }} of {{ totalPages }}</span>
    <button
      :disabled="currentPage === totalPages - 1"
      @click="$emit('page-change', currentPage + 1)"
    >
      Next &#8594;
    </button>
  </div>
</template>

<script setup>
defineProps({
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
</script>

<style></style>
