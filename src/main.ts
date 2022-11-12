import { createApp } from "vue";
import { setupDefaultAxios } from "./api";
import App from "./App.vue";
import "./main.css";
import router from "./router";
import store from "./store";
import axios from "axios";
import { createPinia } from "pinia";

// vue
const app = createApp(App);

// stores
const pinia = createPinia();
app.use(pinia);
app.use(store);

// setup axios
setupDefaultAxios(axios);

app.use(router);
router.push({ name: "dashboard" });
app.mount("#app");
// auto login on reload
// store
//   .dispatch("user/autoLogin")
//   .then(() => {
//     app.use(router);
//   })
//   .catch(() => {

//     // window.location.reload();
//     // alert("Unknown error occurred. Please contact it@law-orga.de.");
//   })
//   .finally(() => {
//     app.mount("#app");
//   });

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
