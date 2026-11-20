import { ref } from "vue";

import useGet2 from "@/composables/useGet2";

import { ArticleList } from "./useLoginPage";

// public articles for "Alle Neuigkeiten": only articles meant for everyone
export function usePublicArticles() {
  const articles = ref<ArticleList[] | null>(null);

  useGet2("api/internal/pages/articles/", articles);

  return {
    articles,
  };
}
