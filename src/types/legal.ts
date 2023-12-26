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
