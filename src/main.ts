import { createApp } from "vue";
import App from "./App.vue";
import "./main.css";
import router from "./router";
import store from "./store";
import createAxios from "./api";

// vue
const app = createApp(App);

app.use(router);

app.use(store);

// mount
app.mount("#app");

// export axios
const axios = createAxios(store);
export { axios };

// auto login on reload
store.dispatch("user/autoLogin");
