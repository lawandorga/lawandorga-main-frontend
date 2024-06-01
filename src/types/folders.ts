export interface Folder {
  name: string;
  uuid: string;
  stop_inherit: boolean;
}

export interface TreeFolder {
  name: string;
  uuid: string;
  stop_inherit: boolean;
  has_access: boolean;
  actions: string[];
}

export interface Access {
  name: string;
  uuid: string | null;
  source: string;
  actions: string[];
}

export interface FolderGroup {
  name: string;
  uuid: string;
}

export interface FolderPerson {
  name: string;
  uuid: string;
}

export interface Content {
  uuid: string;
  name: string;
  repository:
    | "RECORD"
    | "FILE"
    | "QUESTIONNAIRE"
    | "UPLOAD"
    | "RECORDS_RECORD"
    | "FOLDER"
    | "COLLAB";
}

export interface FolderItem {
  folder: TreeFolder;
  children: FolderItem[];
  access: Access[];
  group_access: Access[];
  content: Content[];
}

export interface FolderPage {
  tree: FolderItem[];
  available_persons: FolderPerson[];
  available_groups: FolderGroup[];
}
