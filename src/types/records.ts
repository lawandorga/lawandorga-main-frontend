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
  uuid: string;
  id: number;
  name: string;
  created: string;
  updated: string;
  folder_uuid: string;
  template_name: string;
  entries: { [key: string]: RecordEntry };
  fields: RecordField[];
  show: string[];
  old_record: number;
  delete: boolean;
  folder: string;
  client?: {
    name: string;
    phone: string;
    note: string;
  };
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
  uuid: string;
  order: number;
  type: string;
  name: string;
  kind: string;
  options?: ({ name: string; id: number } | string)[];
};

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
  uuid: string;
  name: string;
  created: string;
  updated: string;
}

export interface IRecordAccess {
  requested_by_detail: string;
  record_detail: string;
  processed_by_detail: string;
  id: number;
  processed_on: string;
  state: string;
  created: string;
  updated: string;
}

export interface RecordDeletion {
  requested_by_detail: string;
  record_detail: string;
  processed_by_detail: string;
  id: number;
  processed: string;
  state: string;
  explanation: string;
  created: string;
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
