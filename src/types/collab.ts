export interface CollabDocument {
  pk: number;
  path: string;
  created: string;
  creator: number;
  child_pages: CollabDocument[];
}

export interface CollabText {
  updated: string;
  created: string;
  creator: number | null;
  document: number;
  is_draft: boolean;
  quill: boolean;
  content: string;
}
