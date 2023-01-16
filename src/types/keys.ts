import { InjectionKey, Ref } from "vue";
import ActionsMailUser from "@/components/ActionsMailUser.vue";
import ActionsMailDomain from "@/components/ActionsMailDomain.vue";

export const actionsMailUserKey = Symbol() as InjectionKey<
  Ref<typeof ActionsMailUser>
>;

export const actionsDomainKey = Symbol() as InjectionKey<
  Ref<typeof ActionsMailDomain>
>;
