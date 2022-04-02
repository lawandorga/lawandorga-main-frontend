export type FormField = {
  label: string;
  name: string;
  type:
    | "multiple"
    | "list"
    | "input"
    | "select"
    | "textarea"
    | "tiptap"
    | "button"
    | "checkbox"
    | "color"
    | "date"
    | "datetime-local"
    | "email"
    | "file"
    | "hidden"
    | "image"
    | "month"
    | "number"
    | "password"
    | "radio"
    | "range"
    | "reset"
    | "search"
    | "submit"
    | "tel"
    | "text"
    | "time"
    | "url"
    | "week";
  autocomplete?: string;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  options?: { name: string; value?: string; id?: number }[];
  room?: string;
  helptext?: string;
};
