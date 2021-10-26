import { createStore } from "vuex";
import alert from "./alert";
import user from "./user";
import collab from "./collab";

const store = createStore({
  modules: {
    alert,
    user,
    collab,
  },
  strict: true,
});

export default store;
