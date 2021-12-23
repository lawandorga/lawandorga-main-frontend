import store from "./store";
import router from "./router";
import axios, { AxiosRequestConfig } from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API_URL as string;

axios.interceptors.request.use(function (
  config: AxiosRequestConfig,
): AxiosRequestConfig {
  if (store.getters["user/isAuthenticated"]) {
    config.headers = {
      ...config.headers,
      Authorization: store.getters["user/token"],
      "private-key": store.getters["user/key"],
    };
  } else {
    config.headers = {
      ...config.headers,
      Authorization: "",
      "private-key": "",
    };
  }
  return config;
});

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    // if the error code is 400 it's supposed to be a form error
    // if there is no response it might be another type of error like a network error
    // we want to catch everything that is not a form error and display an error alert

    // error without a response object attached
    if (!error.response) {
      store.dispatch("alert/createAlert", {
        type: "error",
        heading: `Network Error`,
        message:
          "There seems to be a network error. Make sure you're connected to the internet.",
      });
    }
    // error with file download
    else if (
      error.request.responseType === "blob" &&
      error.response.data instanceof Blob &&
      error.response.data.type &&
      error.response.data.type.toLowerCase().indexOf("json") != -1
    ) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          error.response.data = JSON.parse(reader.result as string);
          store.dispatch("alert/createAlert", {
            type: "error",
            heading: `Error ${error.response.status}`,
            message:
              "detail" in error.response.data ? error.response.data.detail : "",
          });
          resolve(Promise.reject(error));
        };
        reader.onerror = () => {
          reject(error);
        };
        reader.readAsText(error.response.data);
      });
    }
    // authentication error
    else if (error.response.status === 401) {
      store.dispatch("alert/createAlert", {
        type: "error",
        heading: `Error 401`,
        message: "Your token expired, please login again.",
      });
      if (store.getters["user/isAuthenticated"]) {
        const next = window.location.pathname;
        store.dispatch("user/logout");
        router.push({
          name: "user-login",
          query: { next: next },
        });
      }
    }
    // error with detail message
    else if (
      error.response &&
      error.response.data &&
      error.response.data.detail
    ) {
      store.dispatch("alert/createAlert", {
        type: "error",
        heading: `Error ${error.response.status}`,
        message: error.response.data.detail,
      });
    } else if (error.response && error.response.status === 500) {
      store.dispatch("alert/createAlert", {
        type: "error",
        heading: "Error 500",
        message: "Server Error",
      });
    } else if (
      error.response &&
      error.response.status &&
      error.response.statusText &&
      error.response.status !== 400
    ) {
      store.dispatch("alert/createAlert", {
        type: "error",
        heading: `Error ${error.response.status}`,
        message: error.response.statusText,
      });
    }

    // return
    return Promise.reject(error);
  },
);

export default axios;
