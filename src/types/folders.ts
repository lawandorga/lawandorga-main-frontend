export interface IFolder {
  name: string;
  id: string;
}

export interface IAccess {
  name: string;
  slug: string | null;
}

export interface IFolderItem {
  folder: IFolder;
  children: IFolderItem[];
  access: IAccess[];
}

export interface IFolderPage {
  tree: IFolderItem[];
  available_persons: IAccess[];
}
