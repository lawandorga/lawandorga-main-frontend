import useQuery from "@/composables/useQuery";
import { Ref, ref } from "vue";
import useClient from "@/api/client";

export interface UploadLink {
  uuid: string;
  name: string;
  link: string;
  created: string;
  disabled: boolean;
  files: { uuid: string; name: string }[];
}

export function useLink(
  selectedId: Ref<string | number | null>,
  selectedType: Ref<string>,
) {
  const client = useClient();

  const link = ref<UploadLink | null>(null);
  const loading = ref(false);

  const request = client.get<UploadLink>(`api/uploads/query/{}/`, selectedId);

  const linkQuery = useQuery(request, link);

  const query = () => {
    if (link.value && selectedId.value !== link.value.uuid) link.value = null;
    if (selectedType.value === "UPLOAD" && selectedId.value) {
      loading.value = true;
      linkQuery().then(() => {
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
