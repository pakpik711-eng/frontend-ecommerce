<template>
  <div class="profile-container">
    <aside class="sidebar">
      <h2>Account Settings</h2>
      <nav class="tabs-nav">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="tab-btn"
          :class="{ active: currentTab === tab.id }"
          @click="currentTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </nav>
      <button class="logout-btn" @click="handleLogout">Sign Out</button>
    </aside>

    <section class="content-area">
      <component :is="activeComponent" />
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";

import UserDetailsTab from "@/components/profile/UserDetailsTab.vue";
import ChangePasswordTab from "@/components/profile/ChangePasswordTab.vue";
import ManageAddressesTab from "@/components/profile/ManageAddressesTab.vue";
import OrderHistoryTab from "@/components/profile/OrderHistoryTab.vue";

const router = useRouter();
const authStore = useAuthStore();

const currentTab = ref("details");

const tabs = [
  { id: "details", label: "Profile Details" },
  { id: "orders", label: "Order History" },
  { id: "addresses", label: "Saved Addresses" },
  { id: "password", label: "Change Password" },
];

const tabComponents = {
  details: UserDetailsTab,
  orders: OrderHistoryTab,
  addresses: ManageAddressesTab,
  password: ChangePasswordTab,
};

const activeComponent = computed(() => tabComponents[currentTab.value]);

const handleLogout = () => {
  authStore.logout?.();
  router.push("/login");
};
</script>

<style scoped>
.profile-container {
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 1rem;
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 2rem;
}

.sidebar h2 {
  font-size: 1.1rem;
  color: #111827;
  margin-bottom: 1rem;
}

.tabs-nav {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.tab-btn {
  text-align: left;
  padding: 0.6rem 0.8rem;
  background: none;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.15s ease;
}

.tab-btn:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.tab-btn.active {
  background-color: #eff6ff;
  color: #2563eb;
  font-weight: 600;
}

.logout-btn {
  margin-top: 2rem;
  width: 100%;
  padding: 0.5rem;
  background: none;
  border: 1px solid #fca5a5;
  color: #dc2626;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.logout-btn:hover {
  background-color: #fef2f2;
}

.content-area {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  min-height: 380px;
}

@media (max-width: 640px) {
  .profile-container {
    grid-template-columns: 1fr;
  }
}
</style>
