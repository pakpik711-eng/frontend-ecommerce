import { useAuthStore } from "@/stores/authStore";


export function getCurrentUserId() {
  const authStore = useAuthStore();

  if (!authStore.userId) {
    throw new Error("No authenticated user");
  }

  return authStore.userId;
}
