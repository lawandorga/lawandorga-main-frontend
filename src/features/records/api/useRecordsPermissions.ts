import { ref } from "vue";
import useClient from "@/api/client";
import useGet from "@/composables/useGet";

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

  const request = useClient().get(
    "api/permissions/query/has_permissions/record/",
  );
  useGet(request, permissions);

  return {
    permissions,
  };
}
