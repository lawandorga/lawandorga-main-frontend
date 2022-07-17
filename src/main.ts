import { createApp } from "vue";
import { setupDefaultAxios } from "./api";
import App from "./App.vue";
import "./main.css";
import router from "./router";
import store from "./store";
import axios from "axios";

// vue
const app = createApp(App);

app.use(store);

// setup axios
setupDefaultAxios(axios);

// auto login on reload
store
  .dispatch("user/autoLogin")
  .then(() => {
    app.use(router);
  })
  .catch(() => {
    app.use(router);
    router.push({ name: "dashboard" });
    // window.location.reload();
    // alert("Unknown error occurred. Please contact it@law-orga.de.");
  })
  .finally(() => {
    app.mount("#app");
  });
