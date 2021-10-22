import { Alert } from "./alert";
import { RlcUser } from "./user";

export interface AlertState {
  alerts: Alert[];
}

export interface UserState {
  token: string | null;
  key: string | null;
  user: RlcUser | null;
}

export interface RootState {
  alert: AlertState;
  user: UserState;
}
