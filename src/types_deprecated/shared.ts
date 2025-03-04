import { Ref } from "vue";

/*
// helpers
*/
export type Reffed<T extends unknown[]> = T extends (infer U)[]
  ? (Ref<U | null> | U)[]
  : never;

/*
// models
*/
export type JsonModel = {
  // [key: string]: JsonValues | JsonModel | JsonModel[];
  [key: string]: any; // eslint-disable-line
};

export type DjangoModel = { id: number; url?: string; type?: string };
