import { CollabDocument, CollabText } from "./collab";
import { RlcUser, User } from "./user";

export type VoidFunction = () => void;
export type BooleanFunction = () => void;

export interface JsonModel {
  [key: string]: string | boolean | number;
}

export type DjangoModel =
  | JsonModel
  | CollabDocument
  | CollabText
  | User
  | RlcUser;

export interface DjangoError {
  [key: string]: string[] | string;
}
