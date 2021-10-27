export interface CollabDocument {
  name: string;
  pk: number;
  path: string;
  created: string;
  creator: number;
  children: CollabDocument[];
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
