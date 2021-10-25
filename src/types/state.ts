import { Alert } from "./alert";
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
}

export interface RootState {
  alert: AlertState;
  user: UserState;
  collab: CollabState;
}
