import { createStore } from "vuex";
import alert from "./alert";

const store = createStore({
  modules: {
    alert,
  },
  strict: true,
});

export default store;
