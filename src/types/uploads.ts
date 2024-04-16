export interface UploadLink {
  uuid: string;
  name: string;
  link: string;
  created: string;
  disabled: boolean;
  files: { uuid: string; name: string }[];
}
