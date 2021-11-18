export interface Record {
  id: number;
  token: string;
  last_contact_date: Date;
  state: string;
  tags: Tag[];
  working_on_record: [number, string];
  official_note: string;
  created_on: Date;
  last_edited: Date;
  first_contact_date: Date;
  note: string;
  from_rlc: number;
  client: number;
  first_consultation: Date;
  consultant_team: string;
  lawyer: string;
  related_persons: string;
  contact: string;
  bamf_token: string;
  foreign_token: string;
  first_correspondence: string;
  circumstances: string;
  next_steps: string;
  status_described: string;
  additional_facts: string;
}

export interface RestrictedRecord {
  id: number;
  state: string;
  created_on: string;
  last_edited: string;
  record_token: string;
  tags: { id: number; name: string }[];
  working_on_record: { id: number; name: string; email: string }[];
  official_note: string;
  access: boolean;
  delete: boolean;
}

export interface RecordsClient {
  id: string;
  name: string;
  created_on: Date;
  last_edited: Date;
  birthday: Date;
  origin_country: string;
  note: string;
  phone_number: string;
}

export interface Consultant {
  id: number;
  name: string;
}

export interface Country {
  id: number;
  name: string;
  state: string;
}

export interface Message {
  id: number;
  message: string;
  sender: null | {
    id: number;
    name: string;
    email: string;
  };
  created_on: string;
  record: number;
}

export interface RecordsDocument {
  id: number;
  name: string;
  creator: string;
  created_on: Date;
  last_edited: Date;
  file_size: number;
  tags: Tag[];
}

export interface Tag {
  id: number;
  rlc: number;
  name: string;
  created: string;
  updated: string;
}

export interface Questionnaire {
  id: number;
  rlc: number;
  name: string;
  note: string;
  questionnaire: string;
  allow_file_upload: boolean;
  updated: string;
  created: string;
}

export interface RecordQuestionnaire {
  id: number;
  record: number;
  questionnaire: number | Questionnaire;
  answer: string;
  answered: boolean;
  created: string;
  updated: string;
  code: string;
}

export interface RecordPermissionRequest {
  id: string;
  // request_from: RestrictedUser;
  // request_processed: RestrictedUser | null;
  // record: TokenRecord;
  requested: Date;
  processed_on: Date;
  can_edit: boolean;
  state: string;
}

export interface RecordDeletionRequest {
  id: number;
  // request_from: RestrictedUser;
  // request_processed: RestrictedUser | null;
  requested: Date;
  processed_on: Date;
  state: string;
  explanation: string;
  // record?: TokenRecord;
}

export interface Pool {
  type: string;
  entries: Array<{
    id: number;
    enlisted: string;
    consultant?: number;
    record_key?: string;
    record?: number;
    yielder?: number;
  }>;
  number_of_own_enlistings: number;
}
