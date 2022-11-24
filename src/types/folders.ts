export interface IFolder {
  name: string;
  id: string;
}

export interface IAccess {
  name: string;
  slug: string | null;
}

interface Actions {
  [key: string]: string;
}

export interface IContent {
  name: string;
  actions: Actions;
}
export interface IFolderItem {
  folder: IFolder;
  children: IFolderItem[];
  access: IAccess[];
  content: IContent[];
}

export interface IFolderPage {
  tree: IFolderItem[];
  available_persons: IAccess[];
}

export interface IAvailableFolder {
  name: string;
  id: string;
}
