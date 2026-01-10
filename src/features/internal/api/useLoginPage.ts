import useGet2 from "@/composables/useGet2";
import { ref } from "vue";

export interface LoginPage {
  content: string;
  roadmap_items: RoadmapItem[];
  articles: ArticleList[];
}

export interface ArticleList {
  id: number;
  title: string;
  description: string;
  date: string;
}

export interface RoadmapItem {
  id: number;
  title: string;
  description: string;
  date: string;
}

export function useLoginPage() {
  const page = ref<LoginPage | null>(null);

  useGet2("api/internal/pages/index/", page);

  return {
    page,
  };
}
