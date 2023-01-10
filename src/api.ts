import axios, { AxiosInstance } from "axios";
import { useUserStore } from "./store/user";
import { useAlertStore } from "./store/alert";
import { buildContext, handleCommandError } from "./api/errors";
import router from "./router";

export function setupDefaultAxios($axios: AxiosInstance) {
  $axios.defaults.baseURL = import.meta.env.VITE_API_URL as string;
  $axios.defaults.withCredentials = true;
  $axios.defaults.xsrfHeaderName = "x-csrftoken";
  $axios.defaults.xsrfCookieName = "csrftoken";

  $axios.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      // this is in here for now until everything uses the api client
      if (
        error.config &&
        error.response &&
        (error.config.method === "post" ||
          error.config.method === "patch" ||
          error.config.method === "put" ||
          error.config.method === "delete") &&
        error.response.status.toString().startsWith(4) &&
        error.response.status !== 401
      ) {
        const alertStore = useAlertStore();
        const userStore = useUserStore();
        const context = buildContext(error, alertStore, userStore, router);
        return handleCommandError(context);
      }

      // return
      return Promise.reject(error);
    },
  );

  return $axios;
}

export default axios;
