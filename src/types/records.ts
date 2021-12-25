export interface RecordTemplate {
  id: string;
  name: string;
  rlc: number;
  create: string;
  updated: string;
  show: string[];
}

export interface Record {
  id: number;
  created: string;
  updated: string;
  // delete: boolean;
  entries: { [key: string]: RecordEntry };
  fields: RecordField[];
  show?: string[];
  old_record: number;
}

type RecordValue = string | number | boolean | string[] | number[];

export interface RecordEntry {
  id: number;
  name: string;
  order: number;
  value: RecordValue;
  field: number;
  type: string;
  url: string;
}

export interface RecordField {
  id: number;
  url: string;
  name: string;
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

export interface QuestionnaireQuestion {
  id: number;
  question: string;
  type: "FILE";
}

export interface QuestionnaireTemplateFile {
  id: number;
  questionnaire: number;
  name: string;
  created: string;
  updated: string;
}

export interface QuestionnaireTemplate {
  id: number;
  rlc: number;
  name: string;
  note: string;
  questionnaire: string;
  allow_file_upload: boolean;
  updated: string;
  created: string;
  fields?: QuestionnaireQuestion[];
}

export interface Questionnaire {
  id: number;
  record: number;
  template: number | QuestionnaireTemplate;
  answer: string;
  answered: boolean;
  created: string;
  updated: string;
  code: string;
  fields?: { id: number; name: string; question: string; type: "FILE" }[];
}

export interface QuestionnaireAnswer {
  id: number;
  data: string;
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
  record: number;
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
