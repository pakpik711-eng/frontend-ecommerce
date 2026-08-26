<template>
  <div class="cart-item">
    <img :src="item.productImage" :alt="item.productTitle" />

    <div class="product-info">
      <h3>{{ item.productName }}</h3>
      <p>Price: ₹{{ (item.unitPrice || 0).toLocaleString("en-IN") }}</p>

      <div class="quantity-control">
        <button :disabled="item.quantity == 1" @click="decreaseQuantity">
          -
        </button>
        <span>{{ item.quantity }}</span>
        <button @click="increaseQuantity">+</button>
      </div>
      <p>Total: ₹{{ (item.lineTotal || 0).toLocaleString("en-IN") }}</p>

      <button @click="removeItem">Remove</button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(["increase", "decrease", "remove"]);

function increaseQuantity() {
  emit("increase", props.item.cartItemId);
}
function decreaseQuantity() {
  emit("decrease", props.item.cartItemId);
}
function removeItem() {
  emit("remove", props.item.cartItemId);
}
</script>

<style scoped>
.cart-item {
  display: flex;
  gap: 20px;
  padding: 18px;
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  box-shadow: var(--shadow-sm);
}

.cart-item img {
  width: 140px;
  height: 140px;
  object-fit: contain;
  border-radius: var(--radius-md);
  background: var(--color-bg);
}

.product-info {
  flex: 1;
}

.product-info h3 {
  margin: 0 0 8px;
  font-size: 1.05rem;
  font-weight: 500;
  color: var(--color-text-main);
}

.product-info p {
  margin: 6px 0;
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 12px 0;
}

.quantity-control button {
  width: 30px;
  height: 30px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 16px;
  color: var(--color-text-main);
}

.quantity-control button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-control span {
  min-width: 25px;
  text-align: center;
  font-weight: 500;
}

.product-info > button {
  padding: 8px 16px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: var(--color-danger);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.product-info > button:hover {
  background: var(--color-danger-light);
}

@media (max-width: 480px) {
  .cart-item {
    flex-direction: column;
  }

  .cart-item img {
    width: 100%;
    height: 180px;
  }
}
</style>