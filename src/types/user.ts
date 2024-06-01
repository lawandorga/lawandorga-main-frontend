import { Rlc } from "./core";

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

export interface BadgeInformation {
  profiles: number;
  record_deletion_requests: number;
  record_permit_requests: number;
  legal: number;
  record?: number;
}

export type Settings = Record<string, string | boolean>;

export interface DataResponse {
  user: RlcUser;
  rlc: Rlc;
  permissions: string[];
  badges: BadgeInformation;
  settings: Settings;
}
