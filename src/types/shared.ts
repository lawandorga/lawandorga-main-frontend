export type VoidFunction = () => void;
export type BooleanFunction = () => void;

export interface DjangoModel {
  [key: string]: string | boolean | number;
}

export interface DjangoError {
  [key: string]: string[] | string;
}
