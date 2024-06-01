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

export interface LoginPage {
  content: string;
  roadmap_items: RoadmapItem[];
  articles: ArticleList[];
}
