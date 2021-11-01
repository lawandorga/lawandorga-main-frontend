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
