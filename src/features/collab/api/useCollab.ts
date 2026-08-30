import { ref, Ref, watch } from "vue";

import useQuery2 from "@/composables/useQuery2";
import useUrl from "@/composables/useUrl";
import { CollabTemplate } from "@/features/admin/api/useTemplate";

export interface History {
  user: string;
  time: string;
  text: string;
}

export interface Collab {
  uuid: string;
  name: string;
  text: string;
  created_at: string;
  password: string;
  history: History[];
  template: CollabTemplate | null;
}

export function useCollab(
  selectedId: Ref<string | number | null>,
  selectedType: Ref<string>,
) {
  const url = useUrl("api/collab/query/{id}/", {
    pathParams: { id: selectedId },
  });
  const collab = ref<Collab>();
  const collabQuery = useQuery2(url, collab, { autoFetchOnUrlChange: false });

  const update = () => {
    if (collab.value && selectedId.value !== collab.value.uuid)
      collab.value = undefined;
    if (selectedType.value === "COLLAB" && selectedId.value) {
      collabQuery();
    }
  };
  watch(selectedId, update, { immediate: true });

  return { collab, collabQuery };
}
