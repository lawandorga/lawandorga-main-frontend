export interface RecordTemplate {
  id: number;
  name: string;
  rlc: number;
  create: string;
  updated: string;
  show: string[];
}

export interface Record {
  uuid: string;
  id: number;
  name: string;
  created: string;
  updated: string;
  folder_uuid: string;
  template_name: string;
  entries: { [key: string]: RecordValue };
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

export type RecordValue =
  | string
  | number
  | boolean
  | string[]
  | number[]
  | File;

export type RecordField = {
  id: number;
  kind: string;
  label: string;
  name: string;
  options?: ({ name: string; id: number } | string)[];
  type: string;
  uuid: string;
};
