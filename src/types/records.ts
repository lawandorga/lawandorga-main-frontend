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
  id: string;
  // request_from: RestrictedUser;
  // request_processed: RestrictedUser | null;
  requested: Date;
  processed_on: Date;
  state: string;
  explanation: string;
  // record?: TokenRecord;
}
