import { Store } from "vuex";
import { RootState } from "./state";

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $store: Store<RootState>;
  }
}
