import { watch, ref, Ref } from "vue";
import useQuery from "@/composables/useQuery";
import useClient from "@/api/client";

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

  const client = useClient();

  const request = client.get("/api/files/v2/query/{}/", selectedId);
  const filesQuery = useQuery(request, file);

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
