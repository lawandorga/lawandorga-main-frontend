import { ref } from "vue";

import useGet2 from "@/composables/useGet2";

// public data of the landing page (/start/), only published content
export interface LoginPage {
  content: string;
  roadmap_items: RoadmapItem[];
  feature_areas: FeatureArea[];
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
  status: "live" | "planned";
  stage: string;
  benefits: string[];
  status_note: string;
  icon_url: string | null;
  position: number;
}

export interface FeatureArea {
  id: number;
  title: string;
  description: string;
  placement: "showroom" | "more";
  position: number;
  icon_url: string | null;
  screenshot_url: string | null;
  screenshot_alt: string;
  screenshot_note: string;
}

export function useLoginPage() {
  const page = ref<LoginPage | null>(null);

  useGet2("api/internal/pages/index/", page);

  return {
    page,
  };
}
