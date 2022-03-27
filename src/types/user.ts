import { Rlc } from "./core";

export interface User {
  id: number;
  email: string;
  name: string;
  rlc: number;
  rlc_user?: number;
  rlcuserid: number;
}

export interface RlcUser {
  id: number;
  user: number;
  birthday: string;
  phone_number: string;
  street: string;
  city: string;
  postal_code: string;
  locked: boolean;
  email_confirmed: boolean;
  is_active: boolean;
  accepted: boolean;
  updated: string;
  note: string;
  name: string;
  email: string;
  created: string;
}

export interface DashboardInformation {
  records: { identifier: string; id: number; state: string }[];
  members?: { id: number; name: string; rlcuserid: number }[];
  questionnaires?: {
    record_id: number;
    name: string;
    record: string;
  }[];
  changed_records: { identifier: string; id: number; updated: string }[];
}

export interface LoginResponse {
  access: string;
  refresh: string;
  rlc: Rlc;
  user: RlcUser;
  permissions: string[];
}

export interface RefreshResponse {
  access: string;
  refresh: string;
}

export interface DashboardNote {
  id: number;
  title: string;
  note: string;
}
