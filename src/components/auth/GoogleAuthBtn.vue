<template>
  <button class="google-btn" type="button" @click="$emit('click')">
    <img src="@/assets/google.svg" class="google-icon" alt="Google logo" />
    <span>Continue with Google</span>
  </button>
</template>

<script setup>
defineEmits(["click"]);
</script>

<style scoped>
.google-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 0.6rem;
  background-color: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: background-color 0.2s;
}

.google-btn:hover {
  background-color: #f9fafb;
}

.google-icon {
  width: 18px;
  height: 18px;
}
</style>
