<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2>Create an Account</h2>

      <GoogleAuthBtn @click="handleGoogleAuth" />

      <AuthDivider />

      <form @submit.prevent="handleSignup">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            v-model="email"
            type="email"
            id="email"
            placeholder="Enter your email"
            required
          />
        </div>

        <PasswordInput
          id="password"
          label="Password"
          v-model="password"
          placeholder="Enter password"
        />

        <PasswordRules :rules="rules" />

        <PasswordInput
          id="confirmPassword"
          label="Confirm Password"
          v-model="confirmPassword"
          placeholder="Confirm password"
        />
        <span v-if="confirmPassword && !isPasswordMatch" class="error-msg">
          Passwords do not match
        </span>

        <BaseButton
          text="Sign Up"
          class="submit-btn"
          :disabled="!isPasswordValid || !isPasswordMatch"
        />
      </form>

      <p class="toggle-text">
        Already have an account?
        <router-link to="/login" class="link-btn">Log in</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";

import BaseButton from "@/components/common/BaseButton.vue";
import GoogleAuthBtn from "@/components/auth/GoogleAuthBtn.vue";
import AuthDivider from "@/components/auth/AuthDivider.vue";
import PasswordInput from "@/components/auth/PasswordInput.vue";
import PasswordRules from "@/components/auth/PasswordRules.vue";

const router = useRouter();
const authStore = useAuthStore();

const email = ref("");
const password = ref("");
const confirmPassword = ref("");

const rules = computed(() => ({
  minLength: password.value.length > 8,
  hasUpper: /[A-Z]/.test(password.value),
  hasLower: /[a-z]/.test(password.value),
  hasNumber: /[0-9]/.test(password.value),
  hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password.value),
}));

const isPasswordValid = computed(() =>
  Object.values(rules.value).every(Boolean),
);
const isPasswordMatch = computed(
  () => password.value === confirmPassword.value,
);

const handleGoogleAuth = () => {
  console.log("Initiating Google Auth...");
};

const handleSignup = () => {
  if (!isPasswordValid.value || !isPasswordMatch.value) return;

  authStore.login({
    email: email.value,
    password,
  });
  router.push("/");
};
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem 1rem;
}

.auth-card {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

h2 {
  margin-bottom: 1.5rem;
  font-size: 1.35rem;
  color: #111827;
  text-align: center;
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

.form-group input {
  width: 100%;
  padding: 0.6rem 0.8rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  outline: none;
  font-size: 0.9rem;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.form-group input:focus {
  border-color: #2563eb;
}

.error-msg {
  font-size: 0.78rem;
  color: #dc2626;
  margin-top: -0.5rem;
  margin-bottom: 0.5rem;
  display: block;
}

.submit-btn {
  width: 100%;
  margin-top: 0.5rem;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.toggle-text {
  margin-top: 1.25rem;
  text-align: center;
  font-size: 0.875rem;
  color: #4b5563;
}

.link-btn {
  color: #2563eb;
  font-weight: 600;
  text-decoration: underline;
}
</style>
