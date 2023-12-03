import axios, { AxiosInstance } from "axios";

export function setupDefaultAxios($axios: AxiosInstance) {
  $axios.defaults.baseURL = import.meta.env.VITE_API_URL as string;
  $axios.defaults.withCredentials = true;
  $axios.defaults.withXSRFToken = true;
  $axios.defaults.xsrfHeaderName = "x-csrftoken";
  $axios.defaults.xsrfCookieName = "csrftoken";

  return $axios;
}

export default axios;
