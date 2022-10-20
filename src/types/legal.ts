interface LegalRequirementGlobal {
  title: string;
  content: string;
  button_text: string;
  accept_text: string;
}

interface RlcUser {
  name: string;
  id: number;
}

interface LegalRequirementEvent {
  actor: RlcUser | null;
  text: string | null;
  accepted: boolean;
  created: string;
}

export interface LegalRequirement {
  id: number;
  legal_requirement: LegalRequirementGlobal;
  accepted: boolean;
  rlc_user_id: number;
  events_list: LegalRequirementEvent[];
}
