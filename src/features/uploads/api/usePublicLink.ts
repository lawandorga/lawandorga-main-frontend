import useClient from "@/api/client";
import { ref } from "vue";
import useGet from "@/composables/useGet";

export interface UploadLink {
  uuid: string;
  name: string;
  link: string;
  created: string;
  disabled: boolean;
  files: { uuid: string; name: string }[];
}

export function usePublicLink(uuid: string) {
  const client = useClient();

  const link = ref<UploadLink>();
  const request = client.get("api/uploads/query/{}/public/", uuid);
  useGet(request, link);

  return {
    link,
  };
}
