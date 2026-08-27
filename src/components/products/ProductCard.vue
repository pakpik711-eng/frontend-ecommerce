<template>
  <div class="product-card">
    <img
      :src=product.thumbnail
      :alt="product.name"
      class="product-image"
    />

    <div class="product-info">
      <h2>{{ product.name }}</h2>

      <p class="merchants">
        {{ product.merchantCount }} sellers
      </p>

      <button @click="viewProduct">
        View Product
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const props=defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const router=useRouter();

function viewProduct(){
  const productId= props.product.productId;

  router.push({
    name: "ProductDetail",
    params: {
      productId,
    },
  })
  
}


</script>

<style scoped>
.product-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  border-color: var(--color-border);
}

.product-image {
  width: 100%;
  height: 220px;
  object-fit: cover;
  display: block;
  background-color: var(--color-bg);
}

.product-info {
  padding: 16px;
}

.product-info h2 {
  margin: 0 0 8px;
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-text-main);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.merchants {
  margin: 0 0 16px;
  color: var(--color-text-muted);
  font-size: 0.82rem;
}

.product-info button {
  width: 100%;
  padding: 10px;
  border: 1.5px solid var(--color-primary);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: var(--color-primary);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.product-info button:hover {
  background: var(--color-primary);
  color: #ffffff;
}
</style>