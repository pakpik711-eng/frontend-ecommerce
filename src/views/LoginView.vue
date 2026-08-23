<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2>Log In to Your Account</h2>

      <GoogleAuthBtn @click="handleGoogleAuth" />

      <AuthDivider />

      <form @submit.prevent="handleLogin">
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

        <span v-if="loginError" class="error-msg">{{ loginError }}</span>

        <BaseButton text="Log In" class="submit-btn" />
      </form>

      <p class="toggle-text">
        Don't have an account?
        <router-link to="/signup" class="link-btn">Sign up</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";

import BaseButton from "@/components/common/BaseButton.vue";
import GoogleAuthBtn from "@/components/auth/GoogleAuthBtn.vue";
import AuthDivider from "@/components/auth/AuthDivider.vue";
import PasswordInput from "@/components/auth/PasswordInput.vue";

const router = useRouter();
const authStore = useAuthStore();

const email = ref("");
const password = ref("");

const handleGoogleAuth = () => {
  console.log("Initiating Google Auth...");
};

const loginError = ref("");

const handleLogin = async () => {
  loginError.value = "";
  try {
    await authStore.login({
      email: email.value,
      password: password.value,
    });
    router.push("/");
  } catch (err) {
    loginError.value = err.message || "Failed to log in";
  }
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

.submit-btn {
  width: 100%;
  margin-top: 0.5rem;
}

.error-msg {
  font-size: 0.78rem;
  color: #dc2626;
  margin-top: -0.25rem;
  margin-bottom: 0.5rem;
  display: block;
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
