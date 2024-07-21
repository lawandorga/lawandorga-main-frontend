import useGet2 from "@/composables/useGet2";
import { ref } from "vue";
import { Footer } from "./useFooter";
import { Letterhead } from "./useLetterhead";

export type CollabTemplate = {
  name: string;
  description: string | null;
  uuid: string;
  letterhead: Letterhead | null;
  footer: Footer | null;
};

const useTemplate = (id: string) => {
  const template = ref<CollabTemplate>();
  const query = useGet2(`/api/collab/query/template/${id}/`, template);

  return {
    template,
    query,
  };
};

export default useTemplate;
