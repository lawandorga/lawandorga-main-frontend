import { types } from "@lawandorga/components";
import { AlertState } from "@/types/state";
import { defineStore } from "pinia";

export const useAlertStore = defineStore("alert", {
  state: () => ({
    alerts: [] as types.AlertItem[],
  }),
  getters: {
    similar: (state: AlertState) => (alert: { message: string }) =>
      state.alerts.find((item) => item.message === alert.message),
  },
  actions: {
    createAlert(data: {
      heading: string;
      type: "success" | "error";
      message: string;
    }) {
      if (!("heading" in data) || !("type" in data)) return;
      const similar = this.similar(data);
      if (similar && new Date().valueOf() - similar.created < 1000) return;

      const id = Math.random().toString();
      const created = new Date().valueOf();
      const alert: types.AlertItem = { ...data, id, created };
      this.alerts = [alert].concat(this.alerts);
    },
    closeAlert(alert: types.AlertItem) {
      const index = this.alerts.findIndex(
        (item: types.AlertItem) => item.id === alert.id,
      );
      if (index !== -1) this.alerts.splice(index, 1);
    },
    showSuccess(message: string) {
      this.createAlert({
        type: "success",
        heading: message,
        message: "",
      });
    },
  },
});
