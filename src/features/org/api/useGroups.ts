import { Ref, ref } from "vue";
import useGet2 from "@/composables/useGet2";

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

  const query = useGet2("api/org/query/groups/", groups);

  return {
    query,
    groups,
  };
}
