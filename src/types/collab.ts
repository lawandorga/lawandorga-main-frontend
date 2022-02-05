export interface CollabDocument {
  root: boolean;
  name: string;
  id: number;
  path: string;
  created: string;
  updated: string;
  // list
  children?: number[];
  // retrieve
  quill?: boolean;
  content?: string;
}

export interface CollabVersion {
  id: number;
  updated: string;
  created: string;
  creator: number | null;
  document: number;
  is_draft: boolean;
  quill: boolean;
  content: string;
}

export interface CollabPermission {
  id: number;
  name: string;
}

export interface CollabDocumentPermission {
  id: number;
  group_has_permission: number | { id: number; name: string };
  document: number | { id: number; path: string };
  permission: number | { id: number; name: string };
}
