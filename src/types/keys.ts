import { InjectionKey, Ref } from "vue";
import ActionsMailUser from "@/components/ActionsMailUser.vue";

export const actionsMailUserKey = Symbol() as InjectionKey<
  Ref<typeof ActionsMailUser>
>;
