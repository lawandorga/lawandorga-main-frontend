import { Alert } from "@/types/alert";
import { AlertState, RootState } from "@/types/state";
import { ActionContext } from "vuex";

const state: AlertState = {
  alerts: [],
};

const getters = {
  alerts: (state: AlertState) => state.alerts,
};

const actions = {
  createAlert: (context: ActionContext<AlertState, RootState>, data: Alert) => {
    context.commit("addAlert", data);
  },
  closeAlert: (context: ActionContext<AlertState, RootState>, alert: Alert) => {
    context.commit("removeAlert", alert);
  },
  showSuccess: (
    context: ActionContext<AlertState, RootState>,
    message: string,
  ) => {
    context.dispatch("createAlert", {
      type: "success",
      heading: message,
    });
  },
  createAlerts: (context: ActionContext<AlertState, RootState>) => {
    context.dispatch("createAlert", {
      type: "success",
      heading: "Success",
      message: "Hello, I'm a success alert.",
    });
    context.dispatch("createAlert", {
      type: "error",
      heading: "Error",
      message: "Hello, I'm an error alert.",
    });
  },
};

const mutations = {
  addAlert(state: AlertState, alert: Alert) {
    alert["id"] = state.alerts.length + 1;
    state.alerts.push(alert);
  },
  removeAlert(state: AlertState, alert: Alert) {
    const index = state.alerts.findIndex((item: Alert) => item.id === alert.id);
    if (index !== -1) state.alerts.splice(index, 1);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
