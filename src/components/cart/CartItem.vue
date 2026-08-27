<template>
  <div class="cart-item">
    <router-link
      :to="`/product/details/${item.productId}/${item.variantId}?m_id=${item.merchantId}`"
      class="cart-item-link"
    >
      <img :src="item.productImage" :alt="item.productName" />

      <div class="product-info">
        <h3>{{ item.productName }}</h3>
        <p>Price: ₹{{ (item.unitPrice || 0).toLocaleString("en-IN") }}</p>
        <p>Total: ₹{{ (item.lineTotal || 0).toLocaleString("en-IN") }}</p>
      </div>
    </router-link>

    <div class="item-actions">
      <div class="quantity-control">
        <button :disabled="item.quantity == 1" @click="decreaseQuantity">
          -
        </button>
        <span>{{ item.quantity }}</span>
        <button @click="increaseQuantity">+</button>
      </div>

      <button class="remove-btn" @click="removeItem">Remove</button>
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

.cart-item-link {
  display: flex;
  gap: 20px;
  flex: 1;
  min-width: 0;
  text-decoration: none;
  color: inherit;
}

.cart-item img {
  width: 140px;
  height: 140px;
  object-fit: contain;
  border-radius: var(--radius-md);
  background: var(--color-bg);
  flex-shrink: 0;
}

.product-info {
  flex: 1;
  min-width: 0;
}

.product-info h3 {
  margin: 0 0 8px;
  font-size: 1.05rem;
  font-weight: 500;
  color: var(--color-text-main);
}

.cart-item-link:hover .product-info h3 {
  color: var(--color-primary);
}

.product-info p {
  margin: 6px 0;
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

.item-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  flex-shrink: 0;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 10px;
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

.remove-btn {
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

.remove-btn:hover {
  background: var(--color-danger-light);
}

@media (max-width: 480px) {
  .cart-item {
    flex-direction: column;
  }

  .cart-item-link {
    flex-direction: column;
  }

  .cart-item img {
    width: 100%;
    height: 180px;
  }

  .item-actions {
    flex-direction: row;
    align-items: center;
  }
}
</style>
