import { ref } from "vue";
import useGet from "@/composables/useGet";
import useClient from "@/api/client";

export interface Article {
  id: number;
  title: string;
  description: string;
  date: string;
  content?: string;
  author_name?: string;
}

export function useArticle(id: string) {
  const client = useClient();
  const request = client.get(`api/internal/pages/article/${id}/`);
  const article = ref<Article | null>(null);
  useGet(request, article);

  return {
    article,
  };
}
