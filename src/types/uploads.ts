export interface IUploadLink {
  uuid: string;
  name: string;
  link: string;
  created: string;
  disabled: boolean;
  files: { uuid: string; name: string }[];
}

export interface IUploadFile {
  name: string;
}
