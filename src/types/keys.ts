import { InjectionKey, Ref } from "vue";
import { LegalRequirement } from "./legal";

export const legalRequirementsKey = Symbol() as InjectionKey<
  Ref<LegalRequirement[] | null>
>;
