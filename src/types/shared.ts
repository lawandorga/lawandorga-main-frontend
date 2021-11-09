import { CollabDocument, CollabVersion } from "./collab";
import { RlcUser, User } from "./user";

export type VoidFunction = () => void;
export type BooleanFunction = () => void;
export type RequestFunction = (data: DjangoModel | FormData) => Promise<any>; // eslint-disable-line

export interface JsonModel {
  [key: string]: string | boolean | number | number[];
}

export type DjangoModel =
  | JsonModel
  | CollabDocument
  | CollabVersion
  | User
  | RlcUser;

export interface DjangoError {
  [key: string]: string[] | string;
}
