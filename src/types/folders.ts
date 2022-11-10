export interface IFolder {
  name: string;
  id: string;
}

export type IFolderTree = { folder: IFolder; children: [IFolderTree] };

export type ITree<T> = [T, ITree<T>];
