import useGet2 from "@/composables/useGet2";
import { ref } from "vue";

export type Templates = Array<{
  name: string;
  description: string;
  uuid: string;
}>;

const useCollab = () => {
  const templates = ref<Templates>([]);
  const query = useGet2("/api/collab/query/templates/", templates);

  return {
    query,
    templates,
  };
};

export default useCollab;
