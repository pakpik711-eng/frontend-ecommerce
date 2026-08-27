<template>
  <main class="checkout-page">
    <h1>Checkout</h1>
    <p v-if="error" class="error">
      {{ error }}
    </p>
    <div class="checkout-layout">
      <section class="checkout-left">
        <CheckoutAddress
          :addresses="userStore.addresses"
          :selected-address="selectedAddress"
          @select="selectedAddress = $event"
          @add-address="showAddressModal = true"
        />
        <PaymentMethod v-model="paymentMethod" />

        <CheckoutItems :items="checkoutItems" />
      </section>
      <aside>
        <CheckoutSummary :total="checkoutTotal" />
        <button
          class="place-order"
          :disabled="placingOrder || !selectedAddress"
          @click="handlePlaceOrder"
        >
          {{ placingOrder ? "Placing Order..." : "Place Order" }}
        </button>
      </aside>
    </div>
    <AddressModal
      :visible="showAddressModal"
      @close="showAddressModal = false"
      @save="handleAddAddress"
    />
  </main>
</template>

<script setup>
import CheckoutAddress from "@/components/checkout/CheckoutAddress.vue";
import CheckoutItems from "@/components/checkout/CheckoutItems.vue";
import CheckoutSummary from "@/components/checkout/CheckoutSummary.vue";
import PaymentMethod from "@/components/checkout/PaymentMethod.vue";
import AddressModal from "@/components/checkout/AddressModal.vue";
import { useRoute, useRouter } from "vue-router";
import { useCartStore } from "@/stores/cartStore";
import { useUserStore } from "@/stores/userStore";
import { checkoutCart, checkoutCartItem } from "@/services/checkoutApi";
import { computed, onMounted, ref } from "vue";

const router = useRouter();
const route = useRoute();
const cartStore = useCartStore();
const userStore = useUserStore();
const selectedAddress = ref(null);
const paymentMethod = ref("COD");
const showAddressModal = ref(false);

const placingOrder = ref(false);
const error = ref(null);


const buyNowItemId = computed(() => route.query.buyNow || null);

const checkoutItems = computed(() => {
  if (buyNowItemId.value) {
    return cartStore.cartItems.filter(
      (item) => item.cartItemId === buyNowItemId.value,
    );
  }
  return cartStore.cartItems;
});

const checkoutTotal = computed(() => {
  if (buyNowItemId.value) {
    
    return checkoutItems.value[0]?.lineTotal || 0;
  }

 
  return cartStore.totalPrice || 0;
});

onMounted(() => {
  userStore.loadAddresses().then((addresses) => {
    const defaultAddress = addresses.find((address) => address.isDefault);

    if (defaultAddress) {
      selectedAddress.value = defaultAddress.id;
    }

    return cartStore.fetchCart();
  });
});

function handleAddAddress(addressData) {
  return userStore.addAddress(addressData).then(() => {
    showAddressModal.value = false;
  });
}

function handlePlaceOrder() {
  if (!selectedAddress.value) {
    error.value = "Please select a delivery address";
    return;
  }

  placingOrder.value = true;
  error.value = null;

  const address = userStore.addresses.find(
    (a) => a.id === selectedAddress.value,
  );

  const customAddress =
    address && !address.isDefault
      ? {
          addressLine1: address.addressLine1,
          addressLine2: address.addressLine2,
          city: address.city,
          state: address.state,
          country: address.country,
          pincode: address.pincode,
        }
      : undefined;

  const checkout = buyNowItemId.value
    ? checkoutCartItem(buyNowItemId.value, customAddress)
    : checkoutCart(customAddress);

  return checkout
    .then((order) => {
      router.push({
        name: "OrderSuccess",
        query: {
          orderId: order.orderId,
        },
      });
    })
    .catch((err) => {
      error.value = err.message || "Unable to place order";
    })
    .finally(() => {
      placingOrder.value = false;
    });
}
</script>

<style scoped>
.checkout-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 8px 24px 48px;
}

.checkout-page h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text-main);
  margin: 24px 0 20px;
}

.error {
  background-color: var(--color-danger-light);
  color: var(--color-danger);
  border: 1px solid #fecaca;
  border-radius: var(--radius-md);
  padding: 0.85rem 1.2rem;
  margin-bottom: 1rem;
  font-weight: 500;
}

.checkout-layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 24px;
  align-items: start;
}

.checkout-left {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.checkout-layout aside {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.place-order {
  width: 100%;
  padding: 13px;
  border: 1px solid #111214;
  border-radius: 4px;
  background-color: #111214;
  color: #ffffff !important;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
}

.place-order:hover:not(:disabled) {
  background-color: #000000;
  border-color: #000000;
  color: #ffffff !important;
}

.place-order:disabled {
  background-color: #9ca3af;
  border-color: #9ca3af;
  color: #ffffff !important;
  opacity: 1;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .checkout-layout {
    grid-template-columns: 1fr;
  }
}
</style>
