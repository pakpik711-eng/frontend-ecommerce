<template>
  <main class="success">
    <div class="success-card">
      <img
        class="success-icon"
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQP1bsrE0kA1AVi6fxifMQoXjzDkvls2gNzGbJle8kLA&s=10"
        alt="Success"
      />
      <h1>Order Placed Successfully!</h1>
      <p class="success-msg">Thank you for your order.</p>
      <p class="mail-note">Order details have been sent to your email.</p>
      <p class="order-id">
        Order ID: <strong>{{ route.query.orderId }}</strong>
      </p>
      <button class="continue-btn" @click="goHome">Continue Shopping</button>
    </div>
  </main>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
function goHome() {
  router.push("/");
}
</script>

<style scoped>
.success {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem 1rem;
  min-height: calc(100vh - 64px);
}

.success-card {
  text-align: center;
  background: var(--color-surface, #ffffff);
  border: 1px solid var(--color-border, #e3e3e6);
  border-radius: 4px;
  padding: 3rem 2.5rem;
  max-width: 440px;
  width: 100%;
}

.success-icon {
  width: 56px;
  height: 56px;
  object-fit: contain;
  margin-bottom: 1rem;
}

.success-card h1 {
  font-size: 1.4rem;
  font-weight: 700;
  color: #2563eb;
  margin-bottom: 0.75rem;
}

.success-msg {
  color: var(--color-text-muted, #6b7280);
  font-size: 0.95rem;
  margin-bottom: 0.4rem;
}

.mail-note {
  color: var(--color-text-muted, #6b7280);
  font-size: 0.85rem;
  margin-bottom: 1.5rem;
}

.order-id {
  color: var(--color-text-main, #14151a);
  font-size: 0.95rem;
  margin-bottom: 2rem;
}

.continue-btn {
  padding: 0.85rem 2.2rem;
  border: 1px solid #2563eb;
  border-radius: 4px;
  background-color: #2563eb;
  color: #ffffff !important;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
}

.continue-btn:hover {
  background-color: #1d4ed8;
  border-color: #1d4ed8;
  color: #ffffff !important;
}
</style>
