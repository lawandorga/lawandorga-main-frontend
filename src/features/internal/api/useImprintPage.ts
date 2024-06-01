import useClient from "@/api/client";
import useGet from "@/composables/useGet";
import { ref } from "vue";

export interface ImprintPage {
  id: number;
  content: string;
}

export function useImprintPage() {
  const client = useClient();

  const request = client.get("api/internal/pages/imprint/");

  const article = ref<ImprintPage | null>(null);

  useGet(request, article);

  return {
    article,
  };
}
