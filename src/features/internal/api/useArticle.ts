import { ref } from "vue";
import useGet2 from "@/composables/useGet2";

export interface Article {
  id: number;
  title: string;
  description: string;
  date: string;
  content?: string;
  author_name?: string;
}

export function useArticle(id: string) {
  const article = ref<Article | null>(null);
  useGet2(`api/internal/pages/article/${id}/`, article);

  return {
    article,
  };
}
