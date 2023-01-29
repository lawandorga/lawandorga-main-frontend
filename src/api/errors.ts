import { useAlertStore } from "@/store/alert";
import { useUserStore } from "@/store/user";
import { getNextQuery } from "@/utils/router";
import { types } from "@lawandorga/components";
import { AxiosError } from "axios";
import { Router, useRouter } from "vue-router";

interface IContext {
  error: AxiosError;
  alertStore: ReturnType<typeof useAlertStore>;
  userStore: ReturnType<typeof useUserStore>;
  router: Router;
}

export function handleAuthenticationError(context: IContext): Promise<void> {
  const userStore = context.userStore;
  const router = context.router;
  const error = context.error;

  if (error.response && error.response.status === 401) {
    userStore.reset();
    router.push({
      name: "start",
      query: getNextQuery(window.location.pathname),
    });

    return Promise.resolve();
  }
  return Promise.reject(context);
}

export function handleNetworkError(context: IContext): Promise<void> {
  const alertStore = context.alertStore;
  const error = context.error;

  if (!error.response) {
    alertStore.createAlert({
      type: "error",
      heading: `Network Error`,
      message:
        "There seems to be a network error. Make sure you're connected to the internet.",
    });

    return Promise.resolve();
  }
  return Promise.reject(context);
}

export function handleFileDownloadError(context: IContext): Promise<void> {
  const alertStore = context.alertStore;
  const error = context.error;

  if (
    error.request.responseType === "blob" &&
    error.response !== undefined &&
    error.response.data instanceof Blob &&
    error.response.data.type &&
    error.response.data.type.toLowerCase().indexOf("json") != -1
  ) {
    const data: Blob = error.response.data;
    const status: number = error.response.status;

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = JSON.parse(reader.result as string);
        alertStore.createAlert({
          type: "error",
          heading: `Error ${status}`,
          message: "detail" in result ? result.detail : "",
        });
        resolve(Promise.resolve());
      };
      reader.onerror = () => {
        reject(error);
      };
      reader.readAsText(data);
    });
  }

  return Promise.reject(context);
}

export function handleServerError(context: IContext): Promise<void> {
  const alertStore = context.alertStore;
  const error = context.error;

  if (error.response && error.response.status === 500) {
    alertStore.createAlert({
      type: "error",
      heading: "Error 500",
      message: "Server Error",
    });
  }
  return Promise.reject(context);
}

export function handleTitleError(context: IContext): Promise<void> {
  const error = context.error as AxiosError<{ title?: string }>;
  const alertStore = context.alertStore;

  if (error.response && error.response.data && error.response.data.title) {
    alertStore.createAlert({
      type: "error",
      heading: `Error ${error.response.status}`,
      message: error.response.data.title,
    });

    return Promise.resolve();
  }
  return Promise.reject(context);
}

export function handleDetailError(context: IContext): Promise<void> {
  const error = context.error as AxiosError<{ detail?: string }>;
  const alertStore = context.alertStore;

  if (error.response && error.response.data && error.response.data.detail) {
    alertStore.createAlert({
      type: "error",
      heading: `Error ${error.response.status}`,
      message: error.response.data.detail,
    });

    return Promise.resolve();
  }
  return Promise.reject(context);
}

export function resetContext(context: IContext): Promise<void> {
  const error = context.error;
  return Promise.reject(error);
}

type BackendAxiosError =
  | AxiosError<{
      err_type: string;
      title: string;
      status: number;
      detail: string | null;
      instance: string | null;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      internal: any;
      general_errors: string[] | null;
      param_errors: { [key: string]: string[] } | null;
    }>
  | AxiosError<{
      [key: string]: string[];
    }>
  | AxiosError<{
      non_field_errors: string[];
    }>
  | AxiosError<{
      detail: string;
    }>;

export function cleanUpError(error: BackendAxiosError): Promise<void> {
  const newError: types.ICommandError = {
    title: "Unknown Error",
    paramErrors: {},
    generalErrors: [],
  };

  const data = error.response?.data || {};

  if (
    // api layer error
    "param_errors" in data &&
    "general_errors" in data &&
    "title" in data
  ) {
    if (data.general_errors) newError.generalErrors = data.general_errors;
    if (data.param_errors)
      newError.paramErrors =
        data.param_errors as types.ICommandError["paramErrors"];
    if (data.title) newError.title = data.title as types.ICommandError["title"];
  } else if (
    // django rest framework general error
    "detail" in data
  ) {
    if (data.detail)
      newError.title = data.detail as types.ICommandError["title"];
  } else if (
    // django rest framework form error
    Object.keys(data)
  ) {
    if (data.non_field_errors) newError.generalErrors = data.non_field_errors;
    newError.paramErrors = data;
    newError.title = "Request Error";
  }

  return Promise.reject(newError);
}

export function handleQueryError(context: IContext): Promise<void> {
  return Promise.reject(context)
    .catch(handleAuthenticationError)
    .catch(handleNetworkError)
    .catch(handleFileDownloadError)
    .catch(handleServerError)
    .catch(resetContext);
}

export function handleCommandError(context: IContext): Promise<void> {
  return Promise.reject(context)
    .catch((context: IContext) => {
      handleAuthenticationError(context).catch(() => {
        // ignore as command error should always be unhandled for the modal or form
      });
      return Promise.reject(context);
    })
    .catch((context: IContext) => {
      handleNetworkError(context).catch(() => {
        // ignore as command error should always be unhandled for the modal or form
      });
      return Promise.reject(context);
    })
    .catch((context: IContext) => {
      handleServerError(context).catch(() => {
        // ignore as command error should always be unhandled for the modal or form
      });
      return Promise.reject(context);
    })
    .catch(resetContext)
    .catch(cleanUpError);
}

export function handleError(context: IContext): Promise<void> {
  return Promise.reject(context)
    .catch(handleAuthenticationError)
    .catch(handleNetworkError)
    .catch(handleFileDownloadError)
    .catch(handleServerError)
    .catch(handleDetailError)
    .catch(handleTitleError)
    .catch(resetContext)
    .catch(cleanUpError);
}

export function buildContext(
  error: AxiosError,
  alertStore: ReturnType<typeof useAlertStore>,
  userStore: ReturnType<typeof useUserStore>,
  router: Router,
): IContext {
  const context: IContext = {
    error,
    alertStore,
    userStore,
    router,
  };
  return context;
}

export function useErrorHandling() {
  const alertStore = useAlertStore();
  const userStore = useUserStore();
  const router = useRouter();

  const injectHandleError =
    (
      // eslint-disable-next-line no-unused-vars
      f: (context: IContext) => Promise<void>,
      alertStore: IContext["alertStore"],
      userStore: IContext["userStore"],
      router: IContext["router"],
    ) =>
    (error: AxiosError) => {
      const context = buildContext(error, alertStore, userStore, router);
      return f(context);
    };

  const handleQueryErrorInjected = injectHandleError(
    handleQueryError,
    alertStore,
    userStore,
    router,
  );

  const handleFileDownloadErrorInjected = injectHandleError(
    handleFileDownloadError,
    alertStore,
    userStore,
    router,
  );

  const handleCommandErrorInjected = injectHandleError(
    handleCommandError,
    alertStore,
    userStore,
    router,
  );

  const handleErrorInjected = injectHandleError(
    handleError,
    alertStore,
    userStore,
    router,
  );

  return {
    handleQueryError: handleQueryErrorInjected,
    handleCommandError: handleCommandErrorInjected,
    handleFileDownloadError: handleFileDownloadErrorInjected,
    handleError: handleErrorInjected,
  };
}
