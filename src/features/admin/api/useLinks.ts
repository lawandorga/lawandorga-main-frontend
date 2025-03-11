import { ref } from "vue";
import useGet from "@/composables/useGet";
import useClient from "@/api/client";

export function useLinks() {
  const client = useClient();

  const request = client.get("/api/org/query/links/");

  interface Link {
    id: string;
    name: string;
    link: string;
    order: number;
  }
  const links = ref<Link[]>([]);

  const query = useGet(request, links);

  return {
    query,
    links,
  };
}
