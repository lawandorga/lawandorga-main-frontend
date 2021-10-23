import { createApp } from "vue";
import App from "./App.vue";
import "./main.css";
import router from "./router";
import store from "./store";
import axios from "./api";

// vue
const app = createApp(App);

app.use(router);

app.use(store);

// axios
app.config.globalProperties.$axios = axios;

// auto login on reload
store.dispatch("user/autoLogin");

// mount
app.mount("#app");
