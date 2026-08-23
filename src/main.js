import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import { useAuthStore } from "@/stores/authStore";
import "./assets/main.css";

const app = createApp(App);

const pinia = createPinia();

app.use(pinia);
app.use(router);

const authStore = useAuthStore(pinia);

await authStore.initializeAuth();

await router.isReady();

app.mount("#app");
