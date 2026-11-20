import { ref } from "vue";

import useGet2 from "@/composables/useGet2";

import { ArticleList } from "./useLoginPage";

// kept between visits (see useLoginPage), refreshed on every visit
const articles = ref<ArticleList[] | null>(null);

// public articles for "Alle Neuigkeiten": only articles meant for everyone
export function usePublicArticles() {
  useGet2("api/internal/pages/articles/", articles);

  return {
    articles,
  };
}
