import { Alert } from "./alert";

export interface AlertState {
  alerts: Alert[];
}

export interface RootState {
  alert: AlertState;
}
