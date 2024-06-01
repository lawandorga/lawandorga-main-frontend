import { computed, Ref, ref } from "vue";
import useGet from "@/composables/useGet";
import useClient from "@/api/client";

interface GroupMember {
  id: number;
  name: string;
  email: string;
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
  const client = useClient();

  const request = client.get("api/query/group/{}/", id);

  const group = ref(null) as Ref<GroupDetail | null>;
  const query = useGet(request, group);

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
