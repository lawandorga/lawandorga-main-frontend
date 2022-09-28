import { Link } from "./org";

export interface Group {
  id: number;
  name: string;
  creator_id: string;
  members: number[];
  visible: boolean;
  description: string;
  note: string;
}

export interface Rlc {
  id: number;
  name: string;
  use_record_pool: boolean;
  links: Link[];
}

export interface Permission {
  id: number;
  name: string;
  description: string;
  recommended_for: string;
}

export interface HasPermission {
  id: number;
  permission: number;
  user_has_permission: number;
  group_has_permission: number;
  group_object: { name: string; id: number };
  permission_object: { name: string; id: number };
  user_object: { name: string; id: number };
}

export interface Notification {
  description_text: string;
  id: number;
  last_activity: Date;
  created: Date;
  type: string;
  read: boolean;
  ref_id: string;
  ref_text: string;
  notifications: Notification[];
}
