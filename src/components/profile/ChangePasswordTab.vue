<template>
  <div class="tab-content">
    <h3>Change Password</h3>
    <form @submit.prevent="handleChangePassword">
      <PasswordInput
        id="currentPassword"
        label="Current Password"
        v-model="currentPassword"
        placeholder="Enter current password (mock: password123)"
      />

      <PasswordInput
        id="newPassword"
        label="New Password"
        v-model="newPassword"
        placeholder="Enter new password"
      />

      <PasswordRules :rules="rules" />

      <PasswordInput
        id="confirmNewPassword"
        label="Confirm New Password"
        v-model="confirmNewPassword"
        placeholder="Confirm new password"
      />

      <span
        v-if="confirmNewPassword && newPassword !== confirmNewPassword"
        class="error-msg"
      >
        Passwords do not match
      </span>

      <span v-if="apiError" class="error-msg">
        {{ apiError }}
      </span>

      <span v-if="successMsg" class="success-msg">
        {{ successMsg }}
      </span>

      <BaseButton
        :text="userStore.isLoading ? 'Updating...' : 'Update Password'"
        class="save-btn"
        :disabled="
          !currentPassword ||
          !isValid ||
          newPassword !== confirmNewPassword ||
          userStore.isLoading
        "
      />
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useUserStore } from "@/stores/userStore";
import { usePasswordValidation } from "@/composables/usePasswordValidation";
import BaseButton from "@/components/common/BaseButton.vue";
import PasswordInput from "@/components/auth/PasswordInput.vue";
import PasswordRules from "@/components/auth/PasswordRules.vue";

const userStore = useUserStore();

const currentPassword = ref("");
const newPassword = ref("");
const confirmNewPassword = ref("");
const apiError = ref("");
const successMsg = ref("");

const { rules, isValid } = usePasswordValidation(newPassword);

const handleChangePassword = async () => {
  apiError.value = "";
  successMsg.value = "";

  try {
    const res = await userStore.updatePassword({
      currentPassword: currentPassword.value,
      newPassword: newPassword.value,
    });
    successMsg.value = res.message || "Password updated successfully!";
    currentPassword.value = "";
    newPassword.value = "";
    confirmNewPassword.value = "";
  } catch (err) {
    apiError.value = err || "Failed to update password";
  }
};
</script>

<style scoped>
.tab-content h3 {
  margin-bottom: 1.25rem;
  font-size: 1.15rem;
  color: #111827;
}

.error-msg {
  font-size: 0.78rem;
  color: #dc2626;
  margin-top: -0.25rem;
  margin-bottom: 0.5rem;
  display: block;
}

.success-msg {
  font-size: 0.78rem;
  color: #16a34a;
  margin-top: -0.25rem;
  margin-bottom: 0.5rem;
  display: block;
}

.save-btn {
  margin-top: 0.5rem;
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
