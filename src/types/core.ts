import { ILink } from "./org";

export interface Group {
  id: number;
  name: string;
  creator_id: string;
  members: number[];
  visible: boolean;
  description: string;
  note: string;
}

export interface IGroupPermission {
  id: number;
  name: string;
}

export interface IGroupDetail {
  id: number;
  name: string;
  description: string;
  members: GroupMember[];
  permissions: IGroupPermission[];
}
export interface GroupMember {
  id: number;
  name: string;
  email: string;
}

export interface Rlc {
  id: number;
  name: string;
  use_record_pool: boolean;
  links: ILink[];
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
