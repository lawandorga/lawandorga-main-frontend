import { ref } from "vue";
import useGet2 from "@/composables/useGet2";

interface Org {
  id: number;
  name: string;
  default_group_for_new_users: {
    name: string;
    id: number;
  } | null;
  is_events_enabled: boolean;
  is_chat_enabled: boolean;
  is_mail_enabled: boolean;
  user_qualifications: string[];
}

export function useOrg() {
  const org = ref<Org>();

  const query = useGet2("/api/org/query/org/", org);

  return {
    org,
    query,
  };
}
