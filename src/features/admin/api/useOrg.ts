import { ref } from "vue";
import useGet from "@/composables/useGet";
import useClient from "@/api/client";

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

  const client = useClient();
  const request = client.get("/api/org/query/org/");
  const query = useGet(request, org);

  return {
    org,
    query,
  };
}
