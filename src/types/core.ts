export interface Link {
  id: string;
  name: string;
  link: string;
  order: number;
}

export interface Group {
  id: number;
  name: string;
  creator_id: string;
  members: number[];
  visible: boolean;
  description: string;
  note: string;
}

export interface GroupPermission {
  id: number;
  name: string;
}

export interface GroupDetail {
  id: number;
  name: string;
  description: string;
  members: GroupMember[];
  permissions: GroupPermission[];
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
