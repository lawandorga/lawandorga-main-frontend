import { ref } from "vue";

import useGet2 from "@/composables/useGet2";

// public data of the landing page (/start/) from the existing endpoint;
// the landing page itself only uses the articles (articles meant for
// everyone, newest first)
export interface LoginPage {
  content: string;
  roadmap_items: RoadmapItem[];
  articles: ArticleList[];
}

export interface ArticleList {
  id: number;
  title: string;
  preview: string;
  date: string;
}

export interface RoadmapItem {
  id: number;
  title: string;
  description: string;
  date: string;
}

// kept between visits: when the reader comes back (browser back button), the
// page renders at full height right away, so the scroll position can be
// restored; the data is refreshed in the background on every visit
const page = ref<LoginPage | null>(null);

export function useLoginPage() {
  useGet2("api/internal/pages/index/", page);

  return {
    page,
  };
}
