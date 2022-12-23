import { InjectionKey, Ref } from "vue";
import { LegalRequirement } from "./legal";
import ActionsMessages from "@/components/ActionsMessages.vue";
import ActionsQuestionnaires from "@/components/ActionsQuestionnaires.vue";
import ActionsLinks from "@/components/ActionsLinks.vue";
import ActionsLegalRequirements from "@/components/ActionsLegalRequirements.vue";
import ActionsEncryptions from "@/components/ActionsEncryptions.vue";
import ActionsMailUser from "@/components/ActionsMailUser.vue";
import ActionsMailDomain from "@/components/ActionsMailDomain.vue";

export const legalRequirementsKey = Symbol() as InjectionKey<
  Ref<LegalRequirement[] | null>
>;

export const actionsMessagesKey = Symbol() as InjectionKey<
  Ref<typeof ActionsMessages>
>;

export const actionsLegalRequirementsKey = Symbol() as InjectionKey<
  Ref<typeof ActionsLegalRequirements>
>;

export const actionsLinksKey = Symbol() as InjectionKey<
  Ref<typeof ActionsLinks>
>;

export const actionsQuestionnairesKey = Symbol() as InjectionKey<
  Ref<typeof ActionsQuestionnaires>
>;

export const actionsEncryptionsKey = Symbol() as InjectionKey<
  Ref<typeof ActionsEncryptions>
>;

export const actionsMailUserKey = Symbol() as InjectionKey<
  Ref<typeof ActionsMailUser>
>;

export const actionsDomainKey = Symbol() as InjectionKey<
  Ref<typeof ActionsMailDomain>
>;
