import router from "./router";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import store from "./store";

export function setupDefaultAxios($axios: AxiosInstance) {
  $axios.defaults.baseURL = import.meta.env.VITE_API_URL as string;

  $axios.interceptors.request.use(function (
    config: AxiosRequestConfig,
  ): AxiosRequestConfig {
    if (store.getters["user/isAuthenticated"]) {
      config.headers = {
        ...config.headers,
        Authorization: store.getters["user/token"],
      };
    } else {
      config.headers = {
        ...config.headers,
        Authorization: "",
      };
    }
    return config;
  });

  $axios.interceptors.response.use(
    function (response) {
      return response;
    },
    async function (error) {
      // ignore those errors because the modals or forms handle it
      if (
        error.config &&
        error.response &&
        (error.config.method === "post" ||
          error.config.method === "patch" ||
          error.config.method === "put" ||
          error.config.method === "delete") &&
        error.response.status.toString().startsWith(4)
      ) {
        // ignore
      }
      // error without a response object attached
      else if (!error.response) {
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
                "detail" in error.response.data
                  ? error.response.data.detail
                  : "",
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
        // } else if (error.response.status === 401) {
        //   const originalConfig = error.config;
        //   const newToken = await UserService.refresh({
        //     refresh: store.getters["user/refresh"],
        //   });
        //   await store.dispatch("user/refresh", newToken);
        //   originalConfig._retry = true;
        //   originalConfig.headers.Authorization = store.getters["user/token"];
        //   return $axios(originalConfig);
      }
      // error with detail message
      else if (
        error.response &&
        error.response.data &&
        error.response.data.detail &&
        error.response.status !== 400
      ) {
        store.dispatch("alert/createAlert", {
          type: "error",
          heading: `Error ${error.response.status}`,
          message: error.response.data.detail,
        });
        // 500 error
      } else if (error.response && error.response.status === 500) {
        store.dispatch("alert/createAlert", {
          type: "error",
          heading: "Error 500",
          message: "Server Error",
        });
        // error without detail
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

  console.info("axios setup");

  return $axios;
}

export default axios;
