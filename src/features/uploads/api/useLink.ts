import { Ref, ref } from "vue";

import useQuery2 from "@/composables/useQuery2";
import useUrl from "@/composables/useUrl";

export interface UploadLink {
  uuid: string;
  name: string;
  link: string;
  created: string;
  disabled: boolean;
  files: { uuid: string; name: string; created: string }[];
}

export function useLink(
  selectedId: Ref<string | number | null>,
  selectedType: Ref<string>,
) {
  const link = ref<UploadLink>();
  const loading = ref(false);

  const url = useUrl("api/uploads/query/{id}/", {
    pathParams: { id: selectedId },
  });

  const linkQuery = useQuery2(url, link, { autoFetchOnUrlChange: false });

  const query = () => {
    if (link.value && selectedId.value !== link.value.uuid)
      link.value = undefined;
    if (selectedType.value === "UPLOAD" && selectedId.value) {
      loading.value = true;
      linkQuery().finally(() => {
        loading.value = false;
      });
    }
  };

  return {
    query,
    link,
    loading,
  };
}
