export interface IFolder {
  name: string;
  id: string;
}

export type IFolderItem = {
  folder: IFolder;
  children: IFolderItem[];
  access: string[];
};

export type ITree<T> = [T, ITree<T>];
