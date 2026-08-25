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
        <button
          class="place-order"
          :disabled="
            checkoutStore.placingOrder || !selectedAddress || !paymentMethod
          "
          @click="handlePlaceOrder"
        >
          {{ checkoutStore.placingOrder ? "Placing Order..." : "Place Order" }}
        </button>
      </section>
      <aside>
        <CheckoutSummary :subtotal="checkoutStore.subtotal" />
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

<style></style>
