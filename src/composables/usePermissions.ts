import { Ref, ref } from "vue";

import useGet2 from "./useGet2";
import useUrl from "./useUrl";

export interface Permission {
  id: number;
  name: string;
  description: string;
  recommended_for: string;
}

export function usePermissions(
  userId?: Ref<number | undefined>,
  groupId?: Ref<number | undefined>,
) {
  const permissions = ref<Permission[]>();

  const url = useUrl("/api/permissions/query/permissions/", {
    queryParams: {
      user_id: userId,
      group_id: groupId,
    },
  });

  useGet2(url, permissions);

  return { permissions };
}
