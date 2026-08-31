import { computed, Ref, ref } from "vue";

import useGet2 from "@/composables/useGet2";
import type { ActivityState } from "@/features/admin/api/useProfiles";

interface GroupMember {
  id: number;
  name: string;
  email: string;
  last_login_month: string | null;
  activity_state: ActivityState;
}

interface GroupPermission {
  id: number;
  name: string;
}

interface GroupDetail {
  id: number;
  name: string;
  description: string;
  members: GroupMember[];
  permissions: GroupPermission[];
}

export function useGroup(id: string) {
  const group = ref(null) as Ref<GroupDetail | null>;
  const query = useGet2(`api/org/query/group/${id}/`, group);

  const members = computed<GroupMember[] | null>(() => {
    if (!group.value) return null;
    return group.value.members;
  });

  const permissions = computed<GroupPermission[] | null>(() => {
    if (!group.value) return null;
    return group.value.permissions;
  });

  return {
    query,
    members,
    group,
    permissions,
  };
}
