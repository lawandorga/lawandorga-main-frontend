import { CollabDocument, CollabVersion } from "./collab";
import { Group, HasPermission } from "./core";
import { RlcUser, User } from "./user";

export type VoidFunction = () => void;
export type BooleanFunction = () => void;
// post and patch
export type RequestFunction = (
  data: JsonModel, // eslint-disable-line no-unused-vars
  item?: DjangoModel, // eslint-disable-line no-unused-vars
) => Promise<DjangoModel>;
// get
type GetMultipleFunction1 = () => Promise<DjangoModel[]>;
type GetMultipleFunction2 = (data: DjangoModel) => Promise<DjangoModel[]>; // eslint-disable-line no-unused-vars
export type GetMultipleFunction = GetMultipleFunction1 | GetMultipleFunction2;
export type GetSingleFunction = (id: number | string) => Promise<DjangoModel>; // eslint-disable-line no-unused-vars
// delete
export type DeleteFunction = (
  data: JsonModel, // eslint-disable-line no-unused-vars
  item?: DjangoModel, // eslint-disable-line no-unused-vars
) => Promise<void>;

export interface JsonModel {
  [key: string]: string | boolean | number | number[];
}

export type DjangoModel =
  | CollabDocument
  | CollabVersion
  | User
  | HasPermission
  | RlcUser
  | Group;

export interface DjangoError {
  [key: string]: string[] | string;
}
