import useGet2 from "@/composables/useGet2";
import { ref } from "vue";

interface Footer {
  name: string;
  description: string;
  column_1: string | undefined;
  column_2: string | undefined;
  column_3: string | undefined;
  column_4: string | undefined;
}

export function useFooter(id: string) {
  const footer = ref<Footer>();
  const query = useGet2("/api/collab/query/footer/" + id + "/", footer);

  return {
    footer,
    query,
  };
}
