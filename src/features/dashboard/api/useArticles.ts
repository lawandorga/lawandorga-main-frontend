import { ref } from "vue";

import useGet2 from "@/composables/useGet2";

interface Article {
  id: number;
  title: string;
  preview: string;
  date: Date;
}

export function useArticles() {
  const articles = ref<Article[] | null>();
  useGet2("/api/internal/articles/dashboard/", articles);

  return {
    articles,
  };
}
