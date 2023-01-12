/* eslint-disable @typescript-eslint/no-explicit-any, no-unused-vars */

import { downloadFileRequest } from "@/utils/download";
import axios, { AxiosError, AxiosInstance } from "axios";
import { inject, InjectionKey, provide } from "vue";
import { useErrorHandling } from "./errors";

const clientKey = Symbol() as InjectionKey<Client>;

type ErrorHandler = (error: AxiosError) => Promise<void>;
type CallerInstance = AxiosInstance;

class Client {
  caller: CallerInstance;
  queryErrorHandler: ErrorHandler;
  commandErrorHandler: ErrorHandler;

  constructor(
    caller: CallerInstance,
    queryErrorHandler: ErrorHandler,
    commandErrorHandler: ErrorHandler,
  ) {
    this.caller = caller;
    this.queryErrorHandler = queryErrorHandler;
    this.commandErrorHandler = commandErrorHandler;
  }

  /**
   * Attention: Do not use this function on urls that an user can put in!
   * Attention: The regex is vulnerable to super-linear runtime.
   * @param url A url that can be formatted like in python, eg. /api/users/{id}/
   * @param data Dictionary object that must contain the url params, eg. id=123
   * @returns A formatted url, eg. /api/users/123/
   */
  private buildUrl(url: string, data?: any) {
    return url.replace(/{(.*?)}/g, function (group, found) {
      return found in data ? data[found] : group;
    });
  }

  get<R = any>(url: string): (data: any) => Promise<R> {
    return (data: any) =>
      this.caller.get(this.buildUrl(url, data)).then((r) => r.data);
    // .catch(this.queryErrorHandler);
  }

  downloadFile(
    url: string,
  ): (data: { [key: string]: any; filename: string }) => void {
    return (data: any) =>
      downloadFileRequest(this.caller, this.buildUrl(url, data), data.filename);
  }

  post<D = any, R = any>(url: string): (data: D) => Promise<R> {
    return (data: D) =>
      this.caller
        .post(this.buildUrl(url, data), data)
        .then((r) => r.data)
        .catch(this.commandErrorHandler);
  }

  postAsFormData(url: string): (data: { [key: string]: any }) => Promise<void> {
    return (data: { [key: string]: any }) => {
      const formData = new FormData();
      for (const key in data) formData.append(key, data[key]);

      return this.caller
        .post(this.buildUrl(url, data), formData)
        .then(() => {
          /* ignore */
        })
        .catch(this.commandErrorHandler);
    };
  }

  patch(url: string): (data: any) => Promise<void> {
    return (data: any) =>
      this.caller
        .patch(this.buildUrl(url, data), data)
        .then(() => {
          /* ignore */
        })
        .catch(this.commandErrorHandler);
  }

  put(url: string): (data: any) => Promise<void> {
    return (data: any) =>
      this.caller
        .put(this.buildUrl(url, data), data)
        .then(() => {
          /* ignore */
        })
        .catch(this.commandErrorHandler);
  }

  delete(url: string): (data: any) => Promise<void> {
    return (data: any) =>
      this.caller
        .delete(this.buildUrl(url, data))
        .then(() => {
          /* ignore */
        })
        .catch(this.commandErrorHandler);
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

    const { handleQueryError, handleCommandError } = useErrorHandling();
    client = new Client($axios, handleQueryError, handleCommandError);

    provide(clientKey, client);
  }

  return client;
}
