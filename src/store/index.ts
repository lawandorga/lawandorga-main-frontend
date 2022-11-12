import { createStore } from "vuex";
import alert from "./alert";

const store = createStore({
  modules: {
    alert,
  },
  strict: true,
});

console.info("store created");

export default store;
