import { JsonModel } from "./shared";

export interface RecordTemplate {
  id: number;
  name: string;
  rlc: number;
  create: string;
  updated: string;
  show: string[];
}

export interface IRecordListPage {
  records: IListRecord[];
  columns: string[];
}

export interface IListRecord {
  id: number;
  entries: { [key: string]: RecordValue };
  delete_requested: boolean;
  has_access: boolean;
}

export interface Record {
  id: number;
  created: string;
  updated: string;
  // delete: boolean;
  entries: { [key: string]: RecordEntry };
  fields: RecordField[];
  show: string[];
  old_record: number;
  delete: boolean;
  folder: string;
}

type RecordValue = string | number | boolean | string[] | number[] | File;

export type RecordEntry = JsonModel & {
  id: number;
  name: string;
  order: number;
  value: RecordValue;
  field: number;
  type: string;
  url: string;
};

export type RecordField = JsonModel & {
  id: number;
  url: string;
  entry_url: string;
  order: number;
  type: string;
  name: string;
  kind: string;
  options?: ({ name: string; id: number } | string)[];
};

export interface RecordsClient {
  id: number;
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

export type RecordsDocument = JsonModel & {
  id: number;
  name: string;
  creator: string;
  created_on: string;
  last_edited: string;
  file_size: number;
};

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
  notes: string;
  updated: string;
  created: string;
}

export interface Questionnaire {
  id: number;
  code: string;
  record: number;
  template: QuestionnaireTemplate;
  answers: QuestionnaireAnswer[];
  created: string;
  updated: string;
}

interface QuestionnaireField {
  id: number;
  type: string;
  name: string;
  question: string;
}

export interface QuestionnaireAnswer {
  id: number;
  data: string;
  field: QuestionnaireField;
}

export interface RecordAccess {
  requested_by_detail: string;
  record_detail: string;
  processed_by_detail: string;

  id: number;
  requested_by: number;
  processed_by: number;
  record: number;
  processed_on: string;
  state: string;
  created: string;
  updated: string;
}

export interface RecordEncryption {
  id: number;
  user: number;
  record: number;
  user_object: { name: string; id: number };
}

export type RecordDeletion = JsonModel & {
  requested_by_detail: string;
  record_detail: string;
  processed_by_detail: string;

  id: number;
  requested_by: number;
  processed_by: number;
  processed: string;
  state: string;
  explanation: string;
  record: number;
  created: string;
  updated: string;
};

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
