import { CollabDocument, CollabVersion } from "./collab";
import { Group, HasPermission, Permission } from "./core";
import { RlcUser, User } from "./user";
import { Ref } from "vue";
import {
  Questionnaire,
  QuestionnaireField,
  Record,
  RecordDeletionRequest,
  RecordPermissionRequest,
  RecordQuestionnaire,
  RestrictedRecord,
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
  [key: string]: string | boolean | number | number[] | string[];
}

export type JsonModel = KeyValueModel;

export type DjangoModel =
  | CollabDocument
  | CollabVersion
  | User
  | HasPermission
  | RlcUser
  | Group
  | Permission
  | Record
  | RestrictedRecord
  | RecordQuestionnaire
  | Questionnaire
  | QuestionnaireField
  | Questionnaire
  | RecordDeletionRequest
  | RecordPermissionRequest;

/*
// errors
*/
export interface DjangoError {
  [key: string]: string[] | string;
}
