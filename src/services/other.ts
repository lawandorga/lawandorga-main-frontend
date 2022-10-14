import axios from "axios";

const $axios = axios.create();

export function getUpdateStatus() {
  return $axios
    .get(
      "https://lawandorgaupdatefuncpllv4num-status.functions.fnc.fr-par.scw.cloud",
    )
    .then((r) => r.data);
}
