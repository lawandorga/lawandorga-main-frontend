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
