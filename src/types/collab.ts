export interface CollabDocument {
  root: boolean;
  name: string;
  id: number;
  path: string;
  created: string;
  creator: number;
  children: number[];
}

export interface CollabText {
  id: number;
  updated: string;
  created: string;
  creator: number | null;
  document: number;
  is_draft: boolean;
  quill: boolean;
  content: string;
}
