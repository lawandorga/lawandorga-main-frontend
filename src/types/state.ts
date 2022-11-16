import { types } from "@lawandorga/components";
import { Rlc } from "./core";
import { RlcUser } from "./user";

export interface CollabState {
  null: null;
}

export interface AlertState {
  alerts: types.AlertItem[];
}

export interface UserState {
  access: string | null;
  refresh: string | null;
  key: string | null;
  user: RlcUser | null;
  rlc: Rlc | null;
  permissions: string[] | null;
  task: ReturnType<typeof setTimeout> | null;
  notifications: number;
  admin: {
    profiles: number;
    record_deletion_requests: number;
    record_permit_requests: number;
  };
}

export interface RootState {
  alert: AlertState;
  user: UserState;
  collab: CollabState;
}
