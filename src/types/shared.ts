import {
  CollabDocument,
  CollabDocumentPermission,
  CollabVersion,
} from "./collab";
import { Group, HasPermission, Permission } from "./core";
import { DashboardNote, RlcUser, User } from "./user";
import { Ref } from "vue";
import {
  QuestionnaireTemplate,
  QuestionnaireQuestion,
  Record,
  RecordDeletion,
  Questionnaire,
  RecordTemplate,
  RecordField,
  RecordEncryption,
} from "./records";

/*
// helpers
*/
export type Reffed<T> = T extends (infer U)[] ? Ref<U | null>[] : never;

/*
// functions
*/
export type VoidFunction = () => void;
export type BooleanFunction = () => void;
// post and patch
export type RequestFunction = (
  data: JsonModel, // eslint-disable-line no-unused-vars
  item?: DjangoModel, // eslint-disable-line no-unused-vars
) => Promise<DjangoModel>;
// get
export type GetMultipleFunction = (
  data?: DjangoModel, // eslint-disable-line no-unused-vars
) => Promise<DjangoModel[]>;
export type GetSingleFunction = (id: number | string) => Promise<DjangoModel>; // eslint-disable-line no-unused-vars
// delete
export type DeleteFunction = (
  data: JsonModel, // eslint-disable-line no-unused-vars
  item?: DjangoModel, // eslint-disable-line no-unused-vars
) => Promise<void>;

/*
// models
*/
interface KeyValueModel {
  [key: string]:
    | string
    | boolean
    | number
    | number[]
    | string[]
    | KeyValueModel;
}

export type JsonModel = KeyValueModel;

export type DjangoModel = { id: number; url?: string; type?: string };

/*
// errors
*/
export interface DjangoError {
  [key: string]: string[] | string;
}
