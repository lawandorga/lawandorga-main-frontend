import store from "./store";
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
    if (error.response.status === 401) {
      const alert = {
        type: "error",
        heading: `Error 401`,
        message: 'Your token expired, please login again.',
      };
      store.dispatch("alert/createAlert", alert);
      store.dispatch('user/logout');
    }
    else if (error.response && error.response.status !== 400) {
      let text;
      if (error.response.headers["content-type"] === "application/json")
        text = error.response.data.detail;
      else text = error.response.statusText;
      const alert = {
        type: "error",
        heading: `Error ${error.response.status}`,
        message: text,
      };
      store.dispatch("alert/createAlert", alert);
    }
    else if (!error.response) {
      const alert = {
        type: "error",
        heading: "Error",
        message: "An unknown error occurred.",
      };
      store.dispatch("alert/createAlert", alert);
    }
    return Promise.reject(error);
  },
);

export default axios;
