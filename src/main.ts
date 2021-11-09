import { createApp } from "vue";
import App from "./App.vue";
import "./main.css";
import router from "./router";
import store from "./store";
import axios from "./api";

// click outside
const click_outside = {
  beforeMount: function (el, binding, vnode) {
    binding.event = function (event) {
      if (!(el === event.target || el.contains(event.target))) {
        if (binding.value instanceof Function) {
          binding.value(event);
        }
      }
    };
    document.body.addEventListener("click", binding.event);
  },
  unmounted: function (el, binding, vnode) {
    document.body.removeEventListener("click", binding.event);
  },
};

// vue
const app = createApp(App);

app.directive("click-outside", click_outside);

app.use(router);

app.use(store);

// axios
app.config.globalProperties.$axios = axios;

// mount
app.mount("#app");

// auto login on reload
await store.dispatch("user/autoLogin");
