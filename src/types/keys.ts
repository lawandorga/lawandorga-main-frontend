import { InjectionKey, Ref } from "vue";
import { LegalRequirement } from "./legal";
import ActionsMessages from "@/components/ActionsMessages.vue";
import ActionsQuestionnaires from "@/components/ActionsQuestionnaires.vue";
import ActionsLinks from "@/components/ActionsLinks.vue";
import ActionsLegalRequirements from "@/components/ActionsLegalRequirements.vue";
import ActionsDocuments from "@/components/ActionsDocuments.vue";
import ActionsEncryptions from "@/components/ActionsEncryptions.vue";

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

export const actionsDocumentsKey = Symbol() as InjectionKey<
  Ref<typeof ActionsDocuments>
>;

export const actionsEncryptionsKey = Symbol() as InjectionKey<
  Ref<typeof ActionsEncryptions>
>;
