<template>
  <main class="checkout-page">
    <h1>Checkout</h1>
    <p v-if="checkoutStore.error" class="error">
      {{ checkoutStore.error }}
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

        <CheckoutItems :items="checkoutStore.checkoutItems" />
      </section>
      <aside>
        <CheckoutSummary :subtotal="checkoutStore.subtotal" />
        <button
          class="place-order"
          :disabled="
            checkoutStore.placingOrder || !selectedAddress || !paymentMethod
          "
          @click="handlePlaceOrder"
        >
          {{ checkoutStore.placingOrder ? "Placing Order..." : "Place Order" }}
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
import Header from "@/components/common/Header.vue";
import CheckoutAddress from "@/components/checkout/CheckoutAddress.vue";
import CheckoutItems from "@/components/checkout/CheckoutItems.vue";
import CheckoutSummary from "@/components/checkout/CheckoutSummary.vue";
import PaymentMethod from "@/components/checkout/PaymentMethod.vue";
import AddressModal from "@/components/checkout/AddressModal.vue";
import { useRouter } from "vue-router";
import { useCheckoutStore } from "@/stores/checkoutStore";
import { useUserStore } from "@/stores/userStore";
import { onMounted, ref } from "vue";

const router = useRouter();
const checkoutStore = useCheckoutStore();
const userStore = useUserStore();
const selectedAddress = ref(null);
const paymentMethod = ref("COD");
const showAddressModal = ref(false);

onMounted(async () => {
  await userStore.loadAddresses();
});

async function handleAddAddress(addressData) {
  await userStore.addAddress(addressData);
  showAddressModal.value = false;
}

async function handlePlaceOrder() {
  if (!selectedAddress.value) {
    checkoutStore.error = "Please select a delivery address";
    return;
  }
  if (!paymentMethod.value) {
    checkoutStore.error = "Please select a payment method";
    return;
  }
  const orderData = {
    addressId: selectedAddress.value,
    paymentMethod: paymentMethod.value,
  };

  try {
    const order = await checkoutStore.createOrder(orderData);

    router.push({
      name: "OrderSuccess",
      query: {
        orderId: order.id,
      },
    });
  } catch (err) {
    if (err.response?.unavailableItems) {
      checkoutStore.error =
        "Some products are no longer available. Please return to your cart.";
    }
  }
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