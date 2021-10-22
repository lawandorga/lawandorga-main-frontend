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

export default store;
