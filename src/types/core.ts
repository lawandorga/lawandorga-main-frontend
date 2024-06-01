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
