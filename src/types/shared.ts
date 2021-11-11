import { CollabDocument, CollabVersion } from "./collab";
import { Group } from "./core";
import { RlcUser, User } from "./user";

export type VoidFunction = () => void;
export type BooleanFunction = () => void;
export type RequestFunction = (data: DjangoModel) => Promise<DjangoModel>; // eslint-disable-line no-unused-vars
export type GetFunction = () => Promise<DjangoModel[]>;
export type DeleteFunction = (data: DjangoModel) => Promise<void>; // eslint-disable-line no-unused-vars

export interface JsonModel {
  [key: string]: string | boolean | number | number[];
}

export type DjangoModel =
  | CollabDocument
  | CollabVersion
  | User
  | RlcUser
  | Group;

export interface DjangoError {
  [key: string]: string[] | string;
}
