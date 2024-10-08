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
type ErrorFinder = (context: Context) => Promise<ICommandError>;

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

  async run(finderFn: ErrorFinder): Promise<ErrorFinderResult> {
    if (this.isErrorFound()) {
      return this;
    }
    return finderFn(this.context)
      .then((error: ICommandError) => {
        return new ErrorFinderResult(this.context, error);
      })
      .catch(() => {
        return this;
      });
  }
}

const wrapErrorFinder = (finderFn: ErrorFinder) => {
  const wrapped = (result: ErrorFinderResult) => {
    return result.run(finderFn);
  };
  return wrapped;
};

export function handleAuthenticationError(
  context: Context,
): Promise<ICommandError> {
  const userStore = context.userStore;
  const error = context.error;

  if (error.response && error.response.status === 401) {
    userStore.reset();

    window.location.href = getLoginUrl();

    return Promise.resolve({
      title: "Authentication Error",
      paramErrors: {},
      generalErrors: [
        "You are not authenticated. You will be redirected to the login page.",
      ],
    });
  }
  return Promise.reject();
}

export function handleFileTooBigError(
  context: Context,
): Promise<ICommandError> {
  const error = context.error;

  if (error.response && error.response.status === 413) {
    const newError: types.ICommandError = {
      title: "The file is too big",
      paramErrors: {},
      generalErrors: [],
    };

    return Promise.resolve(newError);
  }
  return Promise.reject();
}

export function handleNetworkError(context: Context): Promise<ICommandError> {
  const alertStore = context.alertStore;
  const error = context.error;

  if (!error.response) {
    alertStore.createAlert({
      type: "error",
      heading: `Network Error`,
      message:
        "There seems to be a network error. Make sure you're connected to the internet.",
    });

    return Promise.resolve({
      title: "Network Error",
      paramErrors: {},
      generalErrors: [
        "There seems to be a network error. Make sure you're connected to the internet.",
      ],
    });
  }
  return Promise.reject();
}

export function handleFileDownloadError(
  context: Context,
): Promise<ICommandError> {
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
        resolve(
          Promise.resolve({
            title: `Error ${status}`,
            paramErrors: {},
            generalErrors: ["detail" in result ? result.detail : ""],
          }),
        );
      };
      reader.onerror = () => {
        reject(error);
      };
      reader.readAsText(data);
    });
  }

  return Promise.reject();
}

export function handleServerError(context: Context): Promise<ICommandError> {
  const alertStore = context.alertStore;
  const error = context.error;

  if (error.response && error.response.status === 500) {
    alertStore.createAlert({
      type: "error",
      heading: "Error 500",
      message: "Server Error",
    });
  }
  return Promise.reject();
}

export function handleTitleError(context: Context): Promise<ICommandError> {
  const error = context.error as AxiosError<{ title?: string }>;
  const alertStore = context.alertStore;

  if (error?.response?.data.title) {
    alertStore.createAlert({
      type: "error",
      heading: `Error ${error.response.status}`,
      message: error.response.data.title,
    });

    return Promise.resolve({
      title: error.response.data.title,
      paramErrors: {},
      generalErrors: [],
    });
  }
  return Promise.reject();
}

export function handleDetailError(context: Context): Promise<ICommandError> {
  const error = context.error as AxiosError<{ detail?: string }>;
  const alertStore = context.alertStore;

  if (error.response?.data.detail) {
    alertStore.createAlert({
      type: "error",
      heading: `Error ${error.response.status}`,
      message: error.response.data.detail,
    });

    return Promise.resolve({
      title: `Error ${error.response.status}`,
      paramErrors: {},
      generalErrors: [error.response.data.detail],
    });
  }
  return Promise.reject();
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

export function cleanUpError(context: Context): Promise<ICommandError> {
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

  return Promise.resolve(newError);
}

export function handleQueryError(context: Context): Promise<void> {
  return new ErrorFinderResult(context, undefined)
    .run(handleAuthenticationError)
    .then(wrapErrorFinder(handleNetworkError))
    .then(wrapErrorFinder(handleFileDownloadError))
    .then(wrapErrorFinder(handleServerError))
    .then(wrapErrorFinder(handleDetailError))
    .then(wrapErrorFinder(handleTitleError))
    .then(wrapErrorFinder(cleanUpError))
    .then((result) => Promise.reject(result.getAnyError()));
}

export function handleDownloadError(context: Context): Promise<void> {
  return new ErrorFinderResult(context, undefined)
    .run(handleFileDownloadError)
    .then((result) => Promise.reject(result.getAnyError()));
}

export function handleCommandError(context: Context): Promise<void> {
  return new ErrorFinderResult(context, undefined)
    .run(handleAuthenticationError)
    .then(wrapErrorFinder(handleFileTooBigError))
    .then(wrapErrorFinder(handleNetworkError))
    .then(wrapErrorFinder(handleServerError))
    .then(wrapErrorFinder(cleanUpError))
    .then((result) => Promise.reject(result.getAnyError()));
}

export function handleError(context: Context): Promise<void> {
  return new ErrorFinderResult(context, undefined)
    .run(handleAuthenticationError)
    .then(wrapErrorFinder(handleNetworkError))
    .then(wrapErrorFinder(handleFileDownloadError))
    .then(wrapErrorFinder(handleServerError))
    .then(wrapErrorFinder(handleDetailError))
    .then(wrapErrorFinder(handleTitleError))
    .then(wrapErrorFinder(cleanUpError))
    .then((result) => Promise.reject(result.getAnyError()));
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

export function useErrorHandling() {
  const alertStore = useAlertStore();
  const userStore = useUserStore();
  const router = useRouter();

  const injectHandleError =
    (
      // eslint-disable-next-line no-unused-vars
      f: (context: Context) => Promise<void>,
      alertStore: Context["alertStore"],
      userStore: Context["userStore"],
      router: Context["router"],
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
