/* eslint-disable @typescript-eslint/no-explicit-any, no-unused-vars */

import { blobToDataURL, downloadFileRequest } from "@/utils/download";
import axios, { AxiosInstance } from "axios";
import { inject, InjectionKey, provide, Ref, unref } from "vue";

const clientKey = Symbol() as InjectionKey<Client>;

// type ErrorHandler = (error: AxiosError) => Promise<void>;
type CallerInstance = AxiosInstance;
type UrlParamType =
  | string
  | number
  | undefined
  | Ref<string>
  | Ref<number>
  | Ref<null>
  | Ref<undefined>;

class Client {
  caller: CallerInstance;

  constructor(caller: CallerInstance) {
    this.caller = caller;
  }

  /**
   * Attention: Do not use this function on urls that an user can put in!
   * Attention: The regex is vulnerable to super-linear runtime.
   * @param url A url that can is python like formatted, eg. /api/users/{id}/
   * @param data Dictionary object that must contain the url params, eg. {id: 123}
   * @returns A formatted url, eg. /api/users/123/
   */
  private buildUrlFromObject<D extends Record<string, any>>(
    url: string,
    data?: D,
  ) {
    return url.replace(/{(.*?)}/g, (group: string, found: string) => {
      if (data && found in data) return data[found];
      return group;
    });
  }

  /**
   * Generated by ChatGPT in case you wanted to know.
   * Build a url string by replacing placeholders in the url with arguments.
   * Each placeholder is represented by {} in the url string.
   * @param url The url string, containing placeholders to be replaced.
   * @param params The arguments to replace the placeholders in the url.
   * @returns The formatted url string.
   */
  private buildUrlFromParams(url: string, ...params: UrlParamType[]) {
    return url.replace(/{}/g, function (): string {
      return String(unref(params.shift()));
    });
  }

  private buildUrl<D extends Record<string, any>>(
    url: string,
    data?: D,
    ...params: UrlParamType[]
  ) {
    const url1 = this.buildUrlFromParams(url, ...params);
    const url2 = this.buildUrlFromObject(url1, data);
    return url2;
  }

  get<R = any, D extends Record<string, any> = Record<string, any>>(
    url: string,
    ...params: UrlParamType[]
  ): (data?: D) => Promise<R> {
    return (data?: D) => {
      const builtUrl = this.buildUrl(url, data, ...params);
      return this.caller.get(builtUrl).then((r) => r.data);
    };
  }

  downloadFile(
    url: string,
    ...params: UrlParamType[]
  ): (data?: { [key: string]: any; filename: string }) => Promise<void> {
    return (data?: any) =>
      downloadFileRequest(
        this.caller,
        this.buildUrl(url, data, ...params),
        data.filename,
      );
  }

  downloadDataUrl(
    url: string,
    ...params: UrlParamType[]
  ): (data?: { [key: string]: any; filename: string }) => Promise<string> {
    return (data?: any) =>
      this.caller
        .get(this.buildUrl(url, data, ...params), {
          responseType: "blob",
        })
        .then((r) => blobToDataURL(r.data));
  }

  _data<D extends Record<string, any>>(data?: D): FormData {
    const formData = new FormData();
    for (const key in data) {
      let v: any = data[key];
      if (Array.isArray(v) && v.length == 0) {
        v = "||EMPTYARRAY||";
      } else if (Array.isArray(v)) {
        v = "||ARRAY||".concat(v.join("||ARRAYSEPERATOR||"));
      } else if (v === null) {
        v = "||NULL||";
      }
      formData.append(key, v);
    }
    return formData;
  }

  post<D extends Record<string, any>>(
    url: string,
    ...params: UrlParamType[]
  ): (data?: D) => Promise<void> {
    return (data?: D) => {
      return this.caller
        .post(this.buildUrl(url, data, ...params), this._data(data))
        .then(() => {
          // ignore
        });
    };
  }

  postAndReturn<D extends Record<string, any>, R = any>(
    url: string,
    ...params: UrlParamType[]
  ): (data?: D) => Promise<R> {
    return (data?: D) =>
      this.caller
        .post(this.buildUrl(url, data, ...params), this._data(data))
        .then((r) => r.data);
  }
}

export default function useClient() {
  let client: Client | undefined = inject(clientKey, undefined);

  if (!client) {
    const $axios = axios.create();
    $axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL as string;
    $axios.defaults.withCredentials = true;
    $axios.defaults.xsrfHeaderName = "x-csrftoken";
    $axios.defaults.xsrfCookieName = "csrftoken";

    client = new Client($axios);

    provide(clientKey, client);
  }

  return client;
}
