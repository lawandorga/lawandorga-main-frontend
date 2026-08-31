/**
 * Type representing the ID of a content item
 * Can be a string UUID, a number ID, null for unselected, or undefined for not yet initialized
 */
export type ContentItemId = number | string | null | undefined;

/**
 * Enum for the different types of content that can be selected in the folder view
 */
export enum ContentItemType {
  FOLDER = "FOLDER",
  RECORD = "RECORD",
  FILE = "FILE",
  COLLAB = "COLLAB",
  QUESTIONNAIRE = "QUESTIONNAIRE",
  UPLOAD = "UPLOAD",
  MAIL_IMPORTS = "MAIL_IMPORTS",
  TIMELINE = "TIMELINE",
  ACCESS = "ACCESS",
  RECORDS_RECORD = "RECORDS_RECORD",
  SUBFOLDER = "SUBFOLDER",
}
