import { useAlertStore } from "@/store/alert";
import { useUserStore } from "@/store/user";
import { types } from "lorga-ui";
import { AxiosError } from "axios";
import { Router, useRouter } from "vue-router";
import { getLoginUrl } from "@/utils/login";
import { ICommandError } from "lorga-ui/dist/types/types";

interface Context {
  error: AxiosError;
  alertStore: ReturnType<typeof useAlertStore>;
  userStore: ReturnType<typeof useUserStore>;
  router: Router;
}

// eslint-disable-next-line no-unused-vars
type ErrorFinder = (context: Context) => ICommandError | undefined;

class ErrorFinderResult {
  constructor(
    public context: Context,
    public error: ICommandError | undefined,
  ) {
    this.context = context;
    this.error = error;
  }

  isErrorFound(): boolean {
    return this.error !== undefined;
  }

  getAnyError(): ICommandError {
    if (this.isErrorFound()) {
      return this.error as ICommandError;
    }
    return {
      title: "Unknown Error",
      paramErrors: {},
      generalErrors: [],
    };
  }

  run(finderFn: ErrorFinder): ErrorFinderResult {
    if (this.isErrorFound()) {
      return this;
    }
    const result = finderFn(this.context);
    if (result) {
      return new ErrorFinderResult(this.context, result);
    }
    return this;
  }
}

export function handleAuthenticationError(
  context: Context,
): ICommandError | undefined {
  const userStore = context.userStore;
  const error = context.error;

  if (error.response && error.response.status === 401) {
    userStore.reset();

    window.location.href = getLoginUrl();

    return {
      title: "Authentication Error",
      paramErrors: {},
      generalErrors: [
        "You are not authenticated. You will be redirected to the login page.",
      ],
    };
  }
}

export function handleFileTooBigError(
  context: Context,
): ICommandError | undefined {
  const error = context.error;

  if (error.response && error.response.status === 413) {
    const newError: types.ICommandError = {
      title: "The file is too big",
      paramErrors: {},
      generalErrors: [],
    };

    return newError;
  }
}

export function handleNetworkError(
  context: Context,
): undefined | ICommandError {
  const alertStore = context.alertStore;
  const error = context.error;

  if (!error.response) {
    alertStore.createAlert({
      type: "error",
      heading: `Network Error`,
      message:
        "There seems to be a network error. Make sure you're connected to the internet.",
    });

    return {
      title: "Network Error",
      paramErrors: {},
      generalErrors: [
        "There seems to be a network error. Make sure you're connected to the internet.",
      ],
    };
  }
  return;
}

export function handleFileDownloadError(
  context: Context,
): ICommandError | undefined {
  const alertStore = context.alertStore;
  const error = context.error;

  const isJsonBlobError =
    error.request.responseType === "blob" &&
    error.response !== undefined &&
    error.response.data instanceof Blob &&
    error.response.data.type &&
    error.response.data.type.toLowerCase().indexOf("json") != -1;

  if (isJsonBlobError) {
    const status = error.response?.status as number;
    alertStore.createAlert({
      type: "error",
      heading: `Error ${status}`,
      message: "Some error occurred while downloading the file.",
    });
    return {
      title: `Error ${status}`,
      paramErrors: {},
      generalErrors: ["Some error occurred while downloading the file."],
    };
  }
}

export function handleServerError(context: Context): undefined {
  const alertStore = context.alertStore;
  const error = context.error;

  if (error.response && error.response.status === 500) {
    alertStore.createAlert({
      type: "error",
      heading: "Error 500",
      message: "Server Error",
    });
  }
}

export function handleTitleError(context: Context): undefined | ICommandError {
  const error = context.error as AxiosError<{ title?: string }>;
  const alertStore = context.alertStore;

  if (error?.response?.data.title) {
    alertStore.createAlert({
      type: "error",
      heading: `Error ${error.response.status}`,
      message: error.response.data.title,
    });

    return {
      title: error.response.data.title,
      paramErrors: {},
      generalErrors: [],
    };
  }
}

export function handleDetailError(context: Context): undefined | ICommandError {
  const error = context.error as AxiosError<{ detail?: string }>;
  const alertStore = context.alertStore;

  if (error.response?.data.detail) {
    alertStore.createAlert({
      type: "error",
      heading: `Error ${error.response.status}`,
      message: error.response.data.detail,
    });

    return {
      title: `Error ${error.response.status}`,
      paramErrors: {},
      generalErrors: [error.response.data.detail],
    };
  }
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

export function cleanUpError(context: Context): ICommandError {
  const error = context.error as BackendAxiosError;

  const newError: types.ICommandError = {
    title: "Unknown Error",
    paramErrors: {},
    generalErrors: [],
  };

  const data = error.response?.data || {};

  try {
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
      if (data.title)
        newError.title = data.title as types.ICommandError["title"];
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
      if (data.non_field_errors) {
        newError.generalErrors = data.non_field_errors;
      }
      newError.paramErrors = data;
      newError.title = "Request Error";
    }
    // eslint-disable-next-line no-unused-vars
  } catch (_) {
    newError.title = "Unknown Error";
    if (error.response?.status)
      newError.title = `Unknown Error (${error.response.status})`;
    newError.paramErrors = {};
    newError.generalErrors = [];
  }

  return newError;
}

export function handleQueryError(context: Context): Promise<void> {
  const res = new ErrorFinderResult(context, undefined)
    .run(handleAuthenticationError)
    .run(handleNetworkError)
    .run(handleFileDownloadError)
    .run(handleServerError)
    .run(handleDetailError)
    .run(handleTitleError)
    .run(cleanUpError);
  return Promise.reject(res.getAnyError());
}

export function handleDownloadError(context: Context): Promise<void> {
  const res = new ErrorFinderResult(context, undefined).run(
    handleFileDownloadError,
  );
  return Promise.reject(res.getAnyError());
}

export function handleCommandError(context: Context): Promise<void> {
  const res = new ErrorFinderResult(context, undefined)
    .run(handleAuthenticationError)
    .run(handleFileTooBigError)
    .run(handleNetworkError)
    .run(handleServerError)
    .run(cleanUpError);
  return Promise.reject(res.getAnyError());
}

export function handleError(context: Context): Promise<void> {
  const res = new ErrorFinderResult(context, undefined)
    .run(handleAuthenticationError)
    .run(handleNetworkError)
    .run(handleFileDownloadError)
    .run(handleServerError)
    .run(handleDetailError)
    .run(handleTitleError)
    .run(cleanUpError);
  return Promise.reject(res.getAnyError());
}

export function buildContext(
  error: AxiosError,
  alertStore: ReturnType<typeof useAlertStore>,
  userStore: ReturnType<typeof useUserStore>,
  router: Router,
): Context {
  const context: Context = {
    error,
    alertStore,
    userStore,
    router,
  };
  return context;
}

function injectHandleError(
  // eslint-disable-next-line no-unused-vars
  f: (context: Context) => Promise<void>,
  alertStore: Context["alertStore"],
  userStore: Context["userStore"],
  router: Context["router"],
) {
  return (error: AxiosError) => {
    const context = buildContext(error, alertStore, userStore, router);
    return f(context);
  };
}

export function useErrorHandling() {
  const alertStore = useAlertStore();
  const userStore = useUserStore();
  const router = useRouter();

  const handleQueryErrorInjected = injectHandleError(
    handleQueryError,
    alertStore,
    userStore,
    router,
  );

  const handleFileDownloadErrorInjected = injectHandleError(
    handleDownloadError,
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
