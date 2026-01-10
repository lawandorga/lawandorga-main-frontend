import { ref } from "vue";
import useGet2 from "@/composables/useGet2";

export function useLinks() {
  interface Link {
    id: string;
    name: string;
    link: string;
    order: number;
  }
  const links = ref<Link[]>([]);

  const query = useGet2("/api/org/query/links/", links);

  return {
    query,
    links,
  };
}
