<template>
  <div class="tab-content">
    <h3>Personal Information</h3>
    <p v-if="userStore.isLoading && !userStore.profile" class="status-msg">
      Loading profile...
    </p>

    <form v-else @submit.prevent="handleSave">
      <div class="form-group">
        <label for="profileName">Full Name</label>
        <input id="profileName" v-model="form.name" type="text" required />
      </div>

      <div class="form-group">
        <label for="profileEmail">Email Address</label>
        <input id="profileEmail" v-model="form.email" type="email" required />
      </div>

      <input
        id="profilePhone"
        v-model="form.phone"
        type="tel"
        placeholder="9876543210"
      />

      <span v-if="form.phone && !isPhoneValid" class="error-msg">
        Enter a valid 10-digit phone number
      </span>

      <BaseButton
        :text="userStore.isLoading ? 'Saving...' : 'Save Changes'"
        class="save-btn"
        :disabled="!isPhoneValid || userStore.isLoading || !isDirty"
      />
    </form>
  </div>
</template>

<script setup>
import { reactive, computed, onMounted } from "vue";
import { useUserStore } from "@/stores/userStore";
import BaseButton from "@/components/common/BaseButton.vue";

const userStore = useUserStore();

const form = reactive({
  name: "",
  email: "",
  phone: "",
});

const populateForm = () => {
  if (userStore.profile) {
    form.name = userStore.profile.name || "";
    form.email = userStore.profile.email || "";
    form.phone = userStore.profile.phone || "";
  }
};

onMounted(async () => {
  if (!userStore.profile) {
    await userStore.loadProfile();
  }
  populateForm();
});

const isDirty = computed(() => {
  if (!userStore.profile) return false;

  return (
    form.name.trim() !== (userStore.profile.name || "") ||
    form.email.trim() !== (userStore.profile.email || "") ||
    form.phone.trim() !== (userStore.profile.phone || "")
  );
});

const handleSave = async () => {
  try {
    await userStore.updateProfile({ ...form });
    alert("Profile details updated successfully!");
  } catch (err) {
    alert(err || "Failed to update profile details.");
  }
};

const phoneRegex = /^[6-9]\d{9}$/;

const isPhoneValid = computed(() => {
  return phoneRegex.test(form.phone);
});
</script>

<style scoped>
.tab-content h3 {
  margin-bottom: 1.25rem;
  font-size: 1.15rem;
  color: #111827;
}

.status-msg {
  font-size: 0.875rem;
  color: #6b7280;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 1rem;
}

label {
  font-size: 0.85rem;
  font-weight: 500;
  color: #374151;
}

input {
  width: 100%;
  padding: 0.6rem 0.8rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.9rem;
  outline: none;
  box-sizing: border-box;
}

input:focus {
  border-color: #2563eb;
}

.save-btn {
  margin-top: 0.5rem;
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-msg {
  display: block;
  margin-top: 0.35rem;
  font-size: 0.78rem;
  line-height: 1.2;
  color: #dc2626;
}

.input-error {
  border-color: #dc2626;
}

.input-error:focus {
  border-color: #dc2626;
  outline: 2px solid rgba(220, 38, 38, 0.1);
}
</style>
