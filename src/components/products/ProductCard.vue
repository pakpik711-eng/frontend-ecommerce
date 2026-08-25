<template>
  <div class="product-card">
    <img
      src= 'https://placehold.co/400x300?text=Product+Image'
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
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.product-image {
  width: 100%;
  height: 220px;
  object-fit: cover;
  display: block;
}

.product-info {
  padding: 16px;
}

.product-info h2 {
  margin: 0 0 8px;
  font-size: 18px;
  color: #222;
}

.merchants {
  margin: 0 0 16px;
  color: #666;
  font-size: 14px;
}

.product-info button {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 6px;
  background: #222;
  color: white;
  font-size: 14px;
  cursor: pointer;
}

.product-info button:hover {
  background: #444;
}
</style>