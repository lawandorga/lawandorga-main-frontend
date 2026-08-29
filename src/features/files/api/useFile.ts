import { watch, ref, Ref } from "vue";

import useQuery2 from "@/composables/useQuery2";
import { useUrl } from "@/composables/useUrl";

export interface File {
  uuid: string;
  name: string;
  created: string;
  updated: string;
}

export function useFile(
  selectedId: Ref<string | number | null>,
  selectedType: Ref<string>,
) {
  const file = ref<null | File>(null);
  const loading = ref(false);

  const url = useUrl("/api/files/v2/query/{id}/", {
    pathParams: { id: selectedId },
  });
  const filesQuery = useQuery2(url, file);

  const query = () => {
    if (selectedType.value === "FILE" && selectedId.value) {
      loading.value = true;
      filesQuery().then(() => {
        loading.value = false;
      });
    }
  };

  watch(selectedId, () => {
    file.value = null;
    query();
  });

  query();

  return {
    file,
    loading,
    query,
  };
}
