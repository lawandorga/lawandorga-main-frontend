export interface Article {
  id: number;
  title: string;
  description: string;
  date: string;
  content?: string;
  author_name?: string;
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

export interface LoginPage {
  content: string;
  roadmap_items: RoadmapItem[];
  articles: ArticleList[];
}

export interface ImprintPage {
  id: number;
  content: string;
}

export interface TomsPage {
  id: number;
  content: string;
}
