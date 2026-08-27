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

        <span v-if="signupError" class="error-msg">
          {{ signupError }}
        </span>

        <BaseButton
          :text="isLoading ? 'Signing up...' : 'Sign Up'"
          class="submit-btn"
          :disabled="!isValid || !isPasswordMatch || isLoading"
        />
      </form>

      <p class="toggle-text">
        Already have an account?

        <router-link
          :to="{
            name: 'Login',
            query: route.query,
          }"
          class="link-btn"
        >
          Log in
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";

import { useAuthStore } from "@/stores/authStore";
import { useUserStore } from "@/stores/userStore";
import { userApi } from "@/services/userApi";

import { usePasswordValidation } from "@/composables/usePasswordValidation";

import BaseButton from "@/components/common/BaseButton.vue";
import GoogleAuthBtn from "@/components/auth/GoogleAuthBtn.vue";
import AuthDivider from "@/components/auth/AuthDivider.vue";
import PasswordInput from "@/components/auth/PasswordInput.vue";
import PasswordRules from "@/components/auth/PasswordRules.vue";

const router = useRouter();
const route = useRoute();

const authStore = useAuthStore();
const userStore = useUserStore();

const email = ref("");
const password = ref("");
const confirmPassword = ref("");

const signupError = ref("");
const isLoading = ref(false);

const { rules, isValid } = usePasswordValidation(password);

const isPasswordMatch = computed(
  () => password.value === confirmPassword.value,
);

const handleGoogleAuth = () => {
  authStore.loginWithGoogle();
};

const getRedirectPath = () => {
  const redirect = route.query.redirect;

  return typeof redirect === "string" ? redirect : "/";
};

const handleSignup = () => {
  if (!isValid.value || !isPasswordMatch.value) {
    return;
  }

  signupError.value = "";
  isLoading.value = true;

  authStore
    .register({
      email: email.value,
      password: password.value,
    })
    .then(() =>
      userApi
        .fetchProfile()
        .then((profile) => {
          userStore.setProfile(profile);
        })
        .catch((error) => {
          console.error("Failed to load user profile:", error);
        }),
    )
    .then(() => router.replace(getRedirectPath()))
    .catch((error) => {
      signupError.value = error.message || "Failed to sign up";
    })
    .finally(() => {
      isLoading.value = false;
    });
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
