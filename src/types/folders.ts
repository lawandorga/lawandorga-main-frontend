export interface IFolder {
  name: string;
  uuid: string;
  stop_inherit: boolean;
}

export interface ITreeFolder {
  name: string;
  uuid: string;
  stop_inherit: boolean;
  has_access: boolean;
  actions: string[];
}

export interface IAccess {
  name: string;
  uuid: string | null;
  source: string;
  actions: string[];
}

export interface IFolderGroup {
  name: string;
  uuid: string;
}

export interface IFolderPerson {
  name: string;
  uuid: string;
}

export interface IContent {
  uuid: string;
  name: string;
  repository:
    | "RECORD"
    | "FILE"
    | "QUESTIONNAIRE"
    | "UPLOAD"
    | "RECORDS_RECORD"
    | "FOLDER";
}

export interface IFolderItem {
  folder: ITreeFolder;
  children: IFolderItem[];
  access: IAccess[];
  group_access: IAccess[];
  content: IContent[];
}

export interface IFolderPage {
  tree: IFolderItem[];
  available_persons: IFolderPerson[];
  available_groups: IFolderGroup[];
}

export interface ISubfolder {
  name: string;
  uuid: string;
}

export interface IFolderDetail {
  folder: IFolder;
  access: IAccess[];
  group_access: IAccess[];
  content: IContent[];
  subfolders: ISubfolder[];
}

export interface IAvailableFolder {
  name: string;
  id: string;
}
