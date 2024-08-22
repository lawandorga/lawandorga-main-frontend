import useGet2 from "@/composables/useGet2";
import { ref } from "vue";

interface Article {
  id: number;
  title: string;
  description: string;
  date: Date;
}

export function useArticles() {
  const articles = ref<Article[] | null>();
  useGet2("/api/internal/articles/dashboard/", articles);

  return {
    articles,
  };
}
