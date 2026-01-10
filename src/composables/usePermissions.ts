import { ref } from "vue";
import useGet2 from "./useGet2";

export interface Permission {
  id: number;
  name: string;
  description: string;
  recommended_for: string;
}

export function usePermissions() {
  const permissions = ref<Permission[]>();
  useGet2("/api/permissions/query/permissions/", permissions);

  return { permissions };
}
