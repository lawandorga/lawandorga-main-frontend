import useGet2 from "@/composables/useGet2";
import { ref } from "vue";

export interface TomsPage {
  id: number;
  content: string;
}

export function useTomsPage() {
  const page = ref<TomsPage | null>(null);

  useGet2("api/internal/pages/toms/", page);

  return {
    page,
  };
}
