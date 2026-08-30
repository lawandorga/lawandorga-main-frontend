import { ref } from "vue";

import useGet2 from "@/composables/useGet2";

export interface UploadLink {
  uuid: string;
  name: string;
  link: string;
  created: string;
  disabled: boolean;
  files: { uuid: string; name: string }[];
}

export function usePublicLink(uuid: string) {
  const link = ref<UploadLink>();
  useGet2(`api/uploads/query/${uuid}/public/`, link);

  return {
    link,
  };
}
