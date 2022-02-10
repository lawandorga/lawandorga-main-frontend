export interface HasPermission {
  permission: number | { id: number; name: string };
  user_has_permission: number | { id: number; name: string };
  group_has_permission: number | { id: number; name: string };
}

export interface Group {
  id: string;
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
}

export interface Permission {
  id: number;
  name: string;
  description: string;
  recommended_for: string;
}

export interface HasPermission {
  id: string;
  permission: number | { id: number; name: string };
  user_has_permission: number | { id: number; name: string };
  group_has_permission: number | { id: number; name: string };
}

export interface Notification {
  description_text: string;
  id: string;
  last_activity: Date;
  created: Date;
  type: string;
  read: boolean;
  ref_id: string;
  ref_text: string;
  notifications: Notification[];
}
