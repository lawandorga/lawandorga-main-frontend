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
  user_id: number;
  birthday: string;
  phone_number: string;
  street: string;
  city: string;
  postal_code: string;
  locked: boolean;
  locked_legal: boolean;
  email_confirmed: boolean;
  is_active: boolean;
  accepted: boolean;
  updated: string;
  note: string;
  name: string;
  email: string;
  created: string;
  speciality_of_study: string | null;
  speciality_of_study_display: string | null;
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

export interface BadgeInformation {
  profiles: number;
  record_deletion_requests: number;
  record_permit_requests: number;
  legal: number;
}

export type Settings = Record<string, string>;

export interface DataResponse {
  user: RlcUser;
  rlc: Rlc;
  permissions: string[];
  badges: BadgeInformation;
  settings: Settings;
}
