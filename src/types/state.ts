import { Alert } from "./alert";
import { Rlc } from "./core";
import { User } from "./user";

export interface CollabState {
  null: null;
}

export interface AlertState {
  alerts: Alert[];
}

export interface UserState {
  token: string | null;
  key: string | null;
  user: User | null;
  rlc: Rlc | null;
  permissions: string[];
  notifications: number;
  admin: {
    profiles: number;
    record_deletion_requests: number;
    record_permit_requests: number;
  } | null;
}

export interface RootState {
  alert: AlertState;
  user: UserState;
  collab: CollabState;
}
