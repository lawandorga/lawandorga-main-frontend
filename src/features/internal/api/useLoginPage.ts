import useClient from "@/api/client";
import useGet from "@/composables/useGet";
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
  const client = useClient();

  const page = ref<LoginPage | null>(null);

  const request = client.get("api/internal/pages/index/");

  useGet(request, page);

  return {
    page,
  };
}
