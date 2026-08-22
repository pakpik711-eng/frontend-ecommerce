<template>
  <div class="divider">
    <span><slot>OR</slot></span>
  </div>
</template>

<style scoped>
.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 1.25rem 0;
}

.divider::before,
.divider::after {
  content: "";
  flex: 1;
  border-bottom: 1px solid #e5e7eb;
}

.divider span {
  padding: 0 0.5rem;
  color: #9ca3af;
  font-size: 0.75rem;
  font-weight: 600;
}
</style>
