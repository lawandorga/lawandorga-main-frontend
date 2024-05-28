import { createApp } from "vue";
import { setupDefaultAxios } from "./api";
import App from "./App.vue";
import "./main.css";
import router from "./router";
import axios from "axios";
import { createPinia } from "pinia";
import { useUserStore } from "./store/user";

// vue
const app = createApp(App);

// release
if (import.meta.env.PROD) {
  const release = import.meta.env.VITE_RELEASE as string;
  console.info(`release: ${release}`);
}

// store
const pinia = createPinia();
app.use(pinia);

// setup axios
setupDefaultAxios(axios);

// use router
app.use(router);

// mount
app.mount("#app");

// check login status
const userStore = useUserStore();
userStore.updateData();

// get the manifest working
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/serviceWorker.js")
    .then(function () {
      // registration successful
    })
    .catch(function () {
      // registration failed
    });
}

// lorga ui config
// import { useConfig } from "lorga-ui";
// const { overwrite } = useConfig();
// overwrite("table.td", "px-10");
