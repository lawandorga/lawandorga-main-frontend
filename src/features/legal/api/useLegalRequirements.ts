import useClient from "@/api/client";
import useGet from "@/composables/useGet";
import { ref } from "vue";

interface LegalRequirementEvent {
  actor: string;
  text: string | null;
  accepted: boolean;
  created: string;
}

export interface LegalRequirement {
  id: number;
  title: string;
  content: string;
  button_text: string;
  accept_text: string;

  accepted_of_user: boolean;
  events_of_user: LegalRequirementEvent[];
}

export function useLegalRequirements() {
  const legalRequirements = ref<LegalRequirement[] | null>(null);

  const client = useClient();
  const request = client.get("api/legal/legal_requirements/");
  const query = useGet(request, legalRequirements);

  return {
    legalRequirements,
    query,
  };
}
