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
    REVOKE_ACCESS: {
      url: string;
      user_uuid: string;
    };
  };
}

interface Actions {
  [key: string]: string;
}

export interface IContent {
  uuid: string;
  name: string;
  actions: Actions;
  repository: "RECORD" | "FILE";
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

export interface IFolderDetail {
  folder: IFolder;
  access: IAccess[];
  content: IContent[];
}

export interface IAvailableFolder {
  name: string;
  id: string;
}
