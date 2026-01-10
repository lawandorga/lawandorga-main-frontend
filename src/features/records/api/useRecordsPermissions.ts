import { ref } from "vue";
import useGet2 from "@/composables/useGet2";

export interface HasPermission {
  id: number;
  permission: number;
  user_has_permission: number;
  group_has_permission: number;
  group_object: { name: string; id: number };
  permission_object: { name: string; id: number };
  user_object: { name: string; id: number };
}

export function useRecordsPermissions() {
  const permissions = ref<HasPermission[] | null>(null);

  useGet2("api/permissions/query/has_permissions/record/", permissions);

  return {
    permissions,
  };
}
