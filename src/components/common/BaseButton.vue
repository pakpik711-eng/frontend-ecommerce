<template>
  <button class="btn" :type="type" :disabled="disabled">
    {{ text }}
  </button>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    default: "Click",
  },

  disabled: {
    type: Boolean,
    default: false,
  },

  type: {
    type: String,
    default: "submit",
  },
});
</script>

<style scoped>
.btn {
  padding: 10px 18px;
  border-radius: 4px;
  border: 1px solid #2563eb;
  background-color: #2563eb;
  color: #ffffff;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
}

.btn:hover:not(:disabled) {
  background-color: #1d4ed8;
  border-color: #1d4ed8;
  color: #ffffff;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
