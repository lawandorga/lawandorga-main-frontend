export interface IArticle {
  id: number;
  title: string;
  description: string;
  date: string;
  content?: string;
  author?: string;
}

export interface IRoadmapItem {
  id: number;
  title: string;
  description: string;
  date: string;
}

export interface ILoginPage {
  content: string;
  roadmap_items: IRoadmapItem[];
}

export interface ImprintPage {
  id: number;
  content: string;
}

export interface TomsPage {
  id: number;
  content: string;
}
