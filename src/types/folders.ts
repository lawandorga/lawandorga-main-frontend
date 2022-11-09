export interface IFolder {
  name: string;
  id: string;
}

export type IFolderTree = [IFolder, [[IFolder, IFolderTree]]];

export type ITree<T> = [T, ITree<T>];
