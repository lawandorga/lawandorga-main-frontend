export interface Article {
  id: number;
  title: string;
  description: string;
  date: string;
  content?: string;
  author?: string;
}

export interface RoadmapItem {
  id: number;
  title: string;
  description: string;
  date: string;
}

export interface LoginPage {
  id: number;
  content: string;
}

export interface ImprintPage {
  id: number;
  content: string;
}

export interface TomsPage {
  id: number;
  content: string;
}
