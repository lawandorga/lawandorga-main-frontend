import { ref } from "vue";

import useGet2 from "@/composables/useGet2";

interface Member {
  id: number;
  name: string;
  rlcuserid: number;
}

export function useMembers() {
  const members = ref<Member[] | null>();
  useGet2("/api/auth/org_users/dashboard/", members);

  return {
    members,
  };
}
