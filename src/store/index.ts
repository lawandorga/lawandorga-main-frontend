import { createStore } from "vuex";
import alert from "./alert";
import user from "./user";

const store = createStore({
  modules: {
    alert,
    user,
  },
  strict: true,
});

console.info("store created");

export default store;
