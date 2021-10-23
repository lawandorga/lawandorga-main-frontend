export interface CollabDocument {
  pk: number;
  path: string;
  created: string;
  creator: number;
  child_pages: CollabDocument[];
}

export interface CollabText {
  content: string;
}
