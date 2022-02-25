import { createApp } from "vue";
import { setupDefaultAxios } from "./api";
import App from "./App.vue";
import "./main.css";
import router from "./router";
import store from "./store";
import axios from "axios";

// vue
const app = createApp(App);

app.use(router);

app.use(store);

// mount
app.mount("#app");

// setup axios
setupDefaultAxios(axios);

// auto login on reload
store.dispatch("user/autoLogin");
