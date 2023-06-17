interface LegalRequirementEvent {
  actor: string;
  text: string | null;
  accepted: boolean;
  created: string;
}

export interface LegalRequirement {
  title: string;
  content: string;
  button_text: string;
  accept_text: string;

  accepted_of_user: boolean;
  events_of_user: LegalRequirementEvent[];
}
