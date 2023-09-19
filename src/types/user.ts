import { Rlc } from "./core";

export interface IRegisterPage {
  orgs: { name: string; id: number }[];
  legal_requirements: {
    title: string;
    id: number;
    content: string;
    accept_required: boolean;
  }[];
}

export interface RlcUserSmall {
  id: number;
  user_id: number;
  phone_number: string | null;
  name: string;
  email: string;
  accepted: boolean;
  email_confirmed: boolean;
  locked: boolean;
  is_active: boolean;
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
  records:
    | { identifier: string; id: number; state: string; uuid: string }[]
    | null;
  members: { id: number; name: string; rlcuserid: number }[] | null;
  questionnaires:
    | {
        name: string;
        folder_uuid: string;
      }[]
    | null;
  changed_records:
    | {
        identifier: string;
        id: number;
        updated: string;
        uuid: string;
      }[]
    | null;
  follow_ups:
    | {
        folder_uuid: string;
        title: string;
        time: string;
      }[]
    | null;
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
