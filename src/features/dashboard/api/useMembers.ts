import useGet2 from "@/composables/useGet2";
import { ref } from "vue";

interface Member {
  id: number;
  name: string;
  rlcuserid: number;
}

export function useMembers() {
  const members = ref<Member[] | null>();
  useGet2("/api/rlc_users/dashboard/", members);

  return {
    members,
  };
}
