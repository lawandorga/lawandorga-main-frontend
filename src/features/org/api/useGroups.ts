import { Ref, ref } from "vue";
import useGet from "@/composables/useGet";
import useClient from "@/api/client";

interface Group {
  id: number;
  name: string;
  creator_id: string;
  members: number[];
  visible: boolean;
  description: string;
  note: string;
}

export function useGroups() {
  const groups = ref(null) as Ref<Group[] | null>;

  const client = useClient();
  const request = client.get("api/query/groups/");

  const query = useGet(request, groups);

  return {
    query,
    groups,
  };
}
