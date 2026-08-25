<template>
  <main class="product-details">
    <div v-if="productStore.loading">Loading ......</div>
    <div v-else-if="productStore.error" class="error">
      {{ productStore.error }}
    </div>
    <template v-else-if="product">
      <section class="product-section">
        <div class="product-images">
          <div class="thumbnail">
            <img :src="product.thumbnail" :alt="product.name" />
          </div>
          <div v-if="selectedVariant?.images?.length" class="variant-images">
            <img
              v-for="image in selectedVariant.images"
              :key="image"
              :src="image"
              :alt="product.name"
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
                :disabled="productStore.loading"
                @click="changeAttribute(attributeName, value)"
              >
                {{ value }}
              </button>
            </div>
          </div>

          <div v-if="selectedMerchant" class="selected-merchant">
            <p>Sold by</p>
            <h3>{{ selectedMerchant.merchantName }}</h3>
            <div class="selected-price">
              ₹{{ formatPrice(selectedMerchant.price) }}
            </div>
            <div>⭐{{ selectedMerchant.rating }}</div>
            <p v-if="selectedMerchant.stock !== undefined">
              Stock: {{ selectedMerchant.stock }}
            </p>
          </div>

          <div class="actions">
            <button
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
          }"
          @click="selectMerchant(merchant)"
        >
          <div class="merchant-info">
            <h3>{{ getMerchantName(merchant) }}</h3>
            <p>⭐{{ merchant.rating }}</p>
            <p>Stock:{{ merchant.stock }}</p>
          </div>
          <div class="merchant-price">
            <strong>₹{{ formatPrice(merchant.price) }} </strong>
          </div>
        </div>
      </section>
      <section class="rating-section">
        <h2>Product Rating</h2>
        <div class="rating">⭐ {{ selectedVariant?.rating }}</div>
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
import { useProductStore } from "@/stores/productStore";
import { computed, onMounted, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
const productStore = useProductStore();
const cartStore = useCartStore();

const product = computed(() => productStore.currentProduct);

const selectedAttributes = reactive({});
const selectedMerchant = computed(() => productStore.selectedMerchant);
const merchants = computed(() => productStore.merchants);
const selectedVariant = computed(() => productStore.selectedVariant);

async function loadProduct() {
  const productId = route.params.productId;
  const merchantId = route.query.merchant;

  if (!productId) {
    return;
  }

  const response = await productStore.loadProduct(productId, merchantId);
  Object.keys(response.selectedVariant?.attributes || {}).forEach(
    (attributeName) => {
      selectedAttributes[attributeName] =
        response.selectedVariant.attributes[attributeName];
    },
  );
}

async function changeAttribute(attributeName, value) {
  selectedAttributes[attributeName] = value;

  try {
    const response = await productStore.changeVariant(route.params.productId, {
      ...selectedAttributes,
    });
    Object.keys(response.attributes || {}).forEach((attribute) => {
      selectedAttributes[attribute] = response.attributes[attribute];
    });

    await router.replace({
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
  } catch (err) {
    console.error(err);
  }
}

function getMerchantName(merchant) {
  return merchant.merchantName;
}

async function selectMerchant(merchant) {
  productStore.selectMerchant(merchant);

  await router.replace({
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
  return Number(price).toLocaleString("en-IN");
}

async function addToCart() {
  if (!selectedMerchant.value) {
    return;
  }

  try {
    await cartStore.addItem({
      productId: product.value.productId,
      variantId: selectedVariant.value.variantId,
      merchantId: selectedMerchant.value.merchantId,
      quantity: 1,
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function buyNow() {
  if (!selectedMerchant.value) {
    return;
  }
  await cartStore.addItem({
    p_id: product.value.productId,
    v_id: selectedVariant.value.variantId,
    m_id: selectedMerchant.value.merchantId,
    quantity: 1,
  });
  router.push({ name: "Checkout" });
}

function formatAttributeName(value) {
  return value
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase());
}

onMounted(loadProduct);
</script>

<style></style>
