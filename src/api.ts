import router from "./router";
import axios, { AxiosInstance } from "axios";
import { getNextQuery } from "./utils/router";
import { useUserStore } from "./store/user";
import { useAlertStore } from "./store/alert";

function getCookie(cname: string) {
  const name = cname + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

export function setupDefaultAxios($axios: AxiosInstance) {
  const alertStore = useAlertStore();

  $axios.defaults.baseURL = import.meta.env.VITE_API_URL as string;
  $axios.defaults.withCredentials = true;
  $axios.defaults.xsrfHeaderName = "x-csrftoken";
  $axios.defaults.xsrfCookieName = "csrftoken";

  // $axios.interceptors.request.use(
  //   function (config) {
  //     config.headers["X-CSRF-TOKEN"] = getCookie("csrftoken");
  //     return config;
  //   },
  //   function (error) {
  //     return error;
  //   },
  // );

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
        error.response.status.toString().startsWith(4) &&
        error.response.status !== 401 &&
        error.response.status !== 403
      ) {
        // ignore
      }
      // error without a response object attached
      else if (!error.response) {
        alertStore.createAlert({
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
            alertStore.createAlert({
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
        const userStore = useUserStore();
        if (userStore.isAuthenticated) {
          userStore.reset();
          router.push({
            name: "user-login",
            query: getNextQuery(window.location.pathname),
          });
        }
      }
      // error with detail message
      else if (
        error.response &&
        error.response.data &&
        error.response.data.detail &&
        error.response.status !== 400
      ) {
        alertStore.createAlert({
          type: "error",
          heading: `Error ${error.response.status}`,
          message: error.response.data.detail,
        });
      }
      // 500 error
      else if (error.response && error.response.status === 500) {
        alertStore.createAlert({
          type: "error",
          heading: "Error 500",
          message: "Server Error",
        });
      }
      // error without detail
      else if (
        error.response &&
        error.response.status &&
        error.response.statusText &&
        error.response.status !== 400
      ) {
        alertStore.createAlert({
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
