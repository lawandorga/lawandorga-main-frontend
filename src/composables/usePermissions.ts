import useClient from "@/api/client";
import { ref } from "vue";
import useGet from "./useGet";

export interface Permission {
  id: number;
  name: string;
  description: string;
  recommended_for: string;
}

export function usePermissions() {
  const client = useClient();
  const request = client.get("/api/permissions/query/permissions/");
  const permissions = ref<Permission[]>();
  useGet(request, permissions);

  return { permissions };
}
