import useClient from "@/api/client";
import useGet from "@/composables/useGet";
import { ref } from "vue";

export interface TomsPage {
  id: number;
  content: string;
}

export function useTomsPage() {
  const client = useClient();
  const request = client.get("api/internal/pages/toms/");
  const page = ref<TomsPage | null>(null);

  useGet(request, page);

  return {
    page,
  };
}
