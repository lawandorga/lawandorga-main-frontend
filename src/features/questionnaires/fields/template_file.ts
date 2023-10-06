export const formFileFields = [
  {
    label: "Name",
    name: "name",
    type: "text",
    required: true,
  },
  {
    label: "File",
    name: "file",
    type: "file",
    required: true,
    helptext:
      "ATTENTION: This file will not be encrypted on the server. It should not contain sensitive information. Uploaded answer pdfs are encrypted.",
  },
];
