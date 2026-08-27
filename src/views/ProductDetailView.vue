<template>
  <main class="product-details">
    <div v-if="loading" class="loading">Loading ......</div>
    <div v-else-if="pageError" class="error">
      {{ pageError }}
    </div>
    <template v-else-if="product">
      <section class="product-section">
        <div class="product-images">
          <div class="thumbnail">
            <img :src="mainImage" :alt="product.name" />
          </div>
          <div v-if="selectedVariant?.images?.length" class="variant-images">
            <img
              v-for="image in selectedVariant.images"
              :key="image"
              :src="image"
              :alt="product.name"
              :class="{ active: mainImage === image }"
              @click="selectImage(image)"
            />
          </div>
        </div>
        <div class="product-info">
          <h1>{{ product.name }}</h1>

          <p class="description">{{ product.description }}</p>
          <div
            v-for="(values, attributeName) in product.attributes"
            :key="attributeName"
            class="attribute"
          >
            <h3>
              {{ formatAttributeName(attributeName) }}
              :
              <strong>
                {{ selectedAttributes[attributeName] }}
              </strong>
            </h3>

            <div class="attribute-options">
              <button
                v-for="value in values"
                :key="value"
                class="attribute-button"
                :class="{
                  selected: selectedAttributes[attributeName] === value,
                }"
                :disabled="loading"
                @click="changeAttribute(attributeName, value)"
              >
                {{ value }}
              </button>
            </div>
          </div>
          <p v-if="variantError" class="error variant-error">
            {{ variantError }}
          </p>

          <div v-if="selectedMerchant" class="selected-merchant">
            <p>Sold by</p>
            <h3>{{ selectedMerchant.merchantName }}</h3>
            <div class="selected-price">
              ₹{{ formatPrice(selectedMerchant.price) }}
            </div>
            <div>⭐{{ selectedMerchant.rating }}</div>
          </div>

          <div
            v-if="selectedMerchant && selectedMerchant.stock > 0"
            class="quantity-selector"
          >
            <span class="quantity-label">Quantity</span>
            <div class="quantity-control">
              <button :disabled="quantity <= 1" @click="decreaseQty">-</button>
              <span>{{ quantity }}</span>
              <button
                :disabled="quantity >= selectedMerchant.stock"
                @click="increaseQty"
              >
                +
              </button>
            </div>
          </div>
          <p v-if="actionError" class="error action-error">
            {{ actionError }}
          </p>

          <div class="actions">
            <button v-if="addedToCart" @click="router.push({ name: 'Cart' })">
              Go to Cart
            </button>
            <button
              v-else
              :disabled="!selectedMerchant || selectedMerchant.stock <= 0"
              @click="addToCart"
            >
              Add to Cart
            </button>
            <button
              :disabled="!selectedMerchant || selectedMerchant.stock <= 0"
              @click="buyNow"
            >
              Buy Now
            </button>
          </div>
        </div>
      </section>

      <section class="merchant-section">
        <h2>Available Sellers</h2>
        <div v-if="!merchants.length" class="no-merchants">
          No sellers available for this variant.
        </div>

        <div
          v-for="merchant in merchants"
          :key="merchant.merchantId"
          class="merchant-card"
          :class="{
            selected: selectedMerchant?.merchantId === merchant.merchantId,
            'out-of-stock': merchant.stock <= 0,
          }"
          @click="merchant.stock > 0 && selectMerchant(merchant)"
        >
          <div class="merchant-info">
            <h3>{{ merchant.merchantName }}</h3>
            <p>⭐{{ merchant.rating }}</p>
          </div>
          <div class="merchant-price">
            <span v-if="merchant.stock <= 0" class="stock-badge"
              >Out of Stock</span
            >
            <strong v-else>₹{{ formatPrice(merchant.price) }} </strong>
          </div>
        </div>
      </section>
      <section class="reviews">
        <h2>Customer Reviews</h2>
        <p>Reviews will come from the Review Service.</p>
      </section>
    </template>
  </main>
</template>
<script setup>
import { useCartStore } from "@/stores/cartStore";
import { getProductDetail, getProductVariant } from "@/services/productApi";
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
const cartStore = useCartStore();
const addedToCart = ref(false);

const loading = ref(false);
const pageError = ref(null);
const actionError = ref(null);
const variantError = ref(null);

const product = ref(null);
const selectedVariant = ref(null);
const merchants = ref([]);
const selectedMerchant = ref(null);

const selectedAttributes = reactive({});

const activeImage = ref(null);
const quantity = ref(1);

const mainImage = computed(
  () =>
    activeImage.value ||
    product.value?.thumbnail ||
    selectedVariant.value?.images?.[0],
);

function selectImage(image) {
  activeImage.value = image;
}

function increaseQty() {
  if (selectedMerchant.value && quantity.value < selectedMerchant.value.stock) {
    quantity.value++;
  }
}

function decreaseQty() {
  if (quantity.value > 1) {
    quantity.value--;
  }
}

function loadProduct() {
  const productId = route.params.productId;
  const merchantId = route.query.merchant;

  if (!productId) {
    return Promise.resolve();
  }

  loading.value = true;
  pageError.value = null;
  return getProductDetail(productId)
    .then((response) => {
      product.value = {
        productId: response.productId,
        name: response.name,
        description: response.description,
        thumbnail: response.thumbnail,
        attributes: response.attributes,
      };

      selectedVariant.value = response.selectedVariant;
      merchants.value = response.selectedVariant?.merchants || [];

      if (merchantId) {
        const merchant = merchants.value.find(
          (item) => String(item.merchantId) === String(merchantId),
        );
        selectedMerchant.value = merchant || merchants.value[0] || null;
      } else {
        selectedMerchant.value = merchants.value[0] || null;
      }

      Object.keys(response.selectedVariant?.attributes || {}).forEach(
        (attributeName) => {
          selectedAttributes[attributeName] =
            response.selectedVariant.attributes[attributeName];
        },
      );

      activeImage.value = null;
      quantity.value = 1;
    })
    .catch((err) => {
      pageError.value = err.message || "Failed to load product";
      throw err;
    })
    .finally(() => {
      loading.value = false;
    });
}

function changeAttribute(attributeName, value) {
  const previousValue = selectedAttributes[attributeName];
  selectedAttributes[attributeName] = value;

  loading.value = true;
  variantError.value = null;

  return getProductVariant(route.params.productId, { ...selectedAttributes })
    .then((response) => {
      selectedVariant.value = response;
      merchants.value = response.merchants || [];
      selectedMerchant.value = merchants.value[0] || null;

      Object.keys(response.attributes || {}).forEach((attribute) => {
        selectedAttributes[attribute] = response.attributes[attribute];
      });

      activeImage.value = null;
      quantity.value = 1;
      addedToCart.value = false;

      return router.replace({
        name: "ProductDetail",
        params: {
          productId: route.params.productId,
        },
        query: {
          ...Object.fromEntries(
            Object.entries(route.query).filter(([key]) => key !== "merchant"),
          ),
        },
      });
    })
    .catch((err) => {
      selectedAttributes[attributeName] = previousValue;
      variantError.value = err.message || "Failed to load variant";
      console.error(err);
    })
    .finally(() => {
      loading.value = false;
    });
}


function selectMerchant(merchant) {
  selectedMerchant.value = merchant;
  quantity.value = 1;
  addedToCart.value = false;

  return router.replace({
    name: "ProductDetail",
    params: {
      productId: route.params.productId,
    },
    query: {
      ...route.query,
      merchant: merchant.merchantId,
    },
  });
}

function formatPrice(price) {
  const value = Number(price);
  return Number.isFinite(value) ? value.toLocaleString("en-IN") : "0";
}
function addToCart() {
  if (!selectedMerchant.value) {
    return Promise.resolve();
  }

  actionError.value = null;

  return cartStore
    .addItem({
      productId: product.value.productId,
      variantId: selectedVariant.value.variantId,
      merchantId: selectedMerchant.value.merchantId,
      quantity: quantity.value,
    })
    .then(() => {
      addedToCart.value = true;
    })
    .catch((err) => {
      actionError.value = err.message || "Unable to add item to cart";
      console.error(err);
    });
}

function buyNow() {
  if (!selectedMerchant.value) {
    return Promise.resolve();
  }

  actionError.value = null;

  return cartStore
    .addItem({
      productId: product.value.productId,
      variantId: selectedVariant.value.variantId,
      merchantId: selectedMerchant.value.merchantId,
      quantity: quantity.value,
    })
    .then((response) => {
      cartStore.setBuyNowItem(response.item.cartItemId);
      router.push({ name: "Checkout" });
    })
    .catch((err) => {
      actionError.value = err.message || "Unable to proceed to checkout";
      console.error(err);
    });
}

function formatAttributeName(value) {
  return value
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase());
}

onMounted(loadProduct);
</script>

<style scoped>
.product-details {
  max-width: 1200px;
  margin: 1.5rem auto 3rem;
  padding: 0 1.5rem;
}

.loading {
  text-align: center;
  font-size: 1.05rem;
  color: var(--color-text-muted);
  padding: 3rem 0;
}

.error {
  background-color: var(--color-danger-light);
  color: var(--color-danger);
  border: 1px solid #fecaca;
  border-radius: var(--radius-md);
  padding: 1rem 1.5rem;
  margin-bottom: 1rem;
  font-weight: 500;
}

.product-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.5rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-sm);
}

.product-images {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.thumbnail img {
  width: 100%;
  max-height: 400px;
  object-fit: contain;
  border-radius: var(--radius-md);
  background: var(--color-bg);
  border: 1px solid var(--color-border-light);
}

.variant-images {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.variant-images img {
  width: 76px;
  height: 76px;
  object-fit: cover;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition:
    border-color 0.2s,
    transform 0.2s;
}

.variant-images img:hover {
  border-color: var(--color-primary);
  transform: scale(1.03);
}

.variant-images img.active {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px var(--color-primary-light);
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.product-info h1 {
  font-size: 1.7rem;
  font-weight: 600;
  color: var(--color-text-main);
  line-height: 1.25;
  margin-bottom: -0.5rem;
}

.product-rating {
  font-size: 0.95rem;
  font-weight: 600;
  color: #b45309;
  background: #fff7e6;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.25rem 0.7rem;
  border-radius: var(--radius-pill);
  width: fit-content;
}

.description {
  font-size: 0.95rem;
  color: var(--color-text-muted);
  border-left: 3px solid var(--color-primary);
  padding-left: 1rem;
}

.attribute {
  margin-top: 0.25rem;
}

.attribute h3 {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text-main);
  margin-bottom: 0.6rem;
}

.attribute-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.attribute-button {
  padding: 0.5rem 1.1rem;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  border-radius: var(--radius-pill);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  color: var(--color-text-main);
}

.attribute-button:hover {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
}

.attribute-button.selected {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #ffffff;
}

.attribute-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.selected-merchant {
  background: var(--color-primary-light);
  border-radius: var(--radius-md);
  padding: 1rem 1.25rem;
  border-left: 4px solid var(--color-primary);
}

.selected-merchant p {
  margin: 0.2rem 0;
  color: var(--color-text-muted);
  font-size: 0.85rem;
}

.selected-merchant h3 {
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--color-text-main);
}

.selected-price {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-top: 0.3rem;
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.quantity-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text-main);
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 10px;
}

.quantity-control button {
  width: 32px;
  height: 32px;
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

.actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 0.25rem;
}

.actions > button {
  padding: 0.75rem 1.8rem;
  border: none;
  border-radius: var(--radius-pill);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    transform 0.15s,
    box-shadow 0.15s,
    background-color 0.15s;
}

.actions > button:first-of-type {
  background: var(--color-primary);
  color: #ffffff;
}

.actions > button:first-of-type:hover:not(:disabled) {
  background: var(--color-primary-hover);
}

.actions > button:last-of-type {
  background: var(--color-text-main);
  color: #ffffff;
}

.actions > button:last-of-type:hover:not(:disabled) {
  background: #000000;
}

.actions > button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.actions > button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.merchant-section {
  margin-top: 2.5rem;
}

.merchant-section h2,
.reviews h2 {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-text-main);
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border-light);
}

.no-merchants {
  text-align: center;
  padding: 2rem;
  background: var(--color-surface);
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  font-weight: 500;
}

.merchant-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--color-surface);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 1rem 1.5rem;
  margin-bottom: 0.65rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.merchant-card:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-sm);
}

.merchant-card.selected {
  border: 2px solid var(--color-primary);
  background: var(--color-primary-light);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.merchant-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.merchant-info h3 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-main);
}

.merchant-info p {
  color: var(--color-text-muted);
  font-size: 0.85rem;
}

.merchant-price {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--color-text-main);
}

.reviews {
  margin-top: 2.5rem;
}

.reviews p {
  background: var(--color-surface);
  padding: 1.5rem;
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  text-align: center;
  border: 1px dashed var(--color-border);
}

@media (max-width: 768px) {
  .product-section {
    grid-template-columns: 1fr;
    padding: 1.5rem;
  }

  .product-info h1 {
    font-size: 1.4rem;
  }

  .merchant-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .actions {
    flex-direction: column;
    align-items: stretch;
  }

  .actions > button {
    padding: 1rem;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .product-details {
    padding: 0 0.75rem;
  }

  .product-section {
    padding: 1rem;
  }

  .product-info h1 {
    font-size: 1.25rem;
  }

  .thumbnail img {
    max-height: 300px;
  }

  .variant-images img {
    width: 60px;
    height: 60px;
  }

  .attribute-button {
    padding: 0.45rem 0.9rem;
    font-size: 0.82rem;
  }
}

.merchant-card.out-of-stock {
  cursor: not-allowed;
  opacity: 0.6;
  background: var(--color-bg);
}

.merchant-card.out-of-stock:hover {
  border-color: var(--color-border);
  box-shadow: none;
}

.stock-badge {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-danger);
}

.action-error {
  max-width: 1200px;
}
</style>
