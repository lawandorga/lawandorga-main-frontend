export interface FilesFolder {
  name: string;
  id: number;
  creator: number;
  created: string;
  parent: number;
  path: FilesFolder[];
  type: "FOLDER";
}

export interface FilesFile {
  id: number;
  type: "FILE";
  name: string;
  key: string;
  exists: boolean;
}

export interface FilesPermission {
  id: number;
  group: { id: number; name: string };
  permission: { id: number; name: string };
  folder: { id: number; name: string };
}

export interface FilesPossiblePermission {
  id: number;
  name: string;
}
