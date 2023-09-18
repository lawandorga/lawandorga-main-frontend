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
  actions: {
    OPEN?: {
      uuid: string;
    };
  };
}

export interface IAccess {
  name: string;
  uuid: string | null;
  source: string;
  actions: {
    REVOKE_ACCESS?: {
      url: string;
      user_uuid: string;
    };
  };
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
  content: IContent[];
}

export interface IFolderPage {
  tree: IFolderItem[];
  available_persons: IAccess[];
}

export interface ISubfolder {
  name: string;
  uuid: string;
}

export interface IFolderDetail {
  folder: IFolder;
  access: IAccess[];
  content: IContent[];
  subfolders: ISubfolder[];
}

export interface IAvailableFolder {
  name: string;
  id: string;
}
