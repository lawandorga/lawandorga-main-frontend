import useGet2 from "@/composables/useGet2";
import { ref } from "vue";

export interface ImprintPage {
  id: number;
  content: string;
}

export function useImprintPage() {
  const article = ref<ImprintPage | null>(null);

  useGet2("api/internal/pages/imprint/", article);

  return {
    article,
  };
}
