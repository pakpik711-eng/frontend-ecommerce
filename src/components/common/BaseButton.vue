<template>
  <button class="btn">{{ text }}</button>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    default: "Click",
  },
});
</script>

<style scoped>
.btn {
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid #2563eb;
  background-color: #2563eb;
  color: #ffffff;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
}

.btn:hover {
  background-color: #1d4ed8;
}
</style>
