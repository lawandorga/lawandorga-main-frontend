import { computed, Ref, ref, watch } from "vue";

import useQuery2 from "@/composables/useQuery2";

interface Group {
  id: number;
  uuid: string;
  name: string;
  creator_id: string;
  members: number[];
  visible: boolean;
  description: string;
  note: string;
}

export function useGroups({
  doQuery = ref(true),
}: { doQuery?: Ref<boolean> } = {}) {
  const groups = ref<Group[]>();

  const query = useQuery2("api/org/query/groups/", groups);
  watch(
    doQuery,
    () => {
      if (doQuery.value) {
        query();
      }
    },
    { immediate: true },
  );

  const formGroups = computed<{ name: string; value: string }[]>(() => {
    if (groups.value) {
      return groups.value.map((group) => ({
        name: group.name,
        value: group.uuid,
      }));
    }
    return [];
  });

  return {
    query,
    groups,
    formGroups,
  };
}
