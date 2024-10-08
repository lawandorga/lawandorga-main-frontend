import useClient from "@/api/client";
import { useUserStore } from "@/store/user";
import { computed, ref } from "vue";

export interface Apps {
  [key: string]: () => Promise<void>;
}

export function useRunOptimizations() {
  const client = useClient();

  const apps: Apps = {
    Groups: () =>
      client
        .post("api/command/")({ action: "org/optimize_groups" })
        .catch((e) => {
          return Promise.reject(e);
        }),
    Records: () =>
      client
        .post("api/command/")({ action: "data_sheets/optimize" })
        .catch((e) => {
          return Promise.reject(e);
        }),
    Collab: () =>
      client
        .post("api/command/")({ action: "collab/optimize" })
        .catch((e) => {
          return Promise.reject(e);
        }),
    Folders: () =>
      client
        .post("api/command/")({ action: "folders/optimize" })
        .catch((e) => {
          return Promise.reject(e);
        }),
    Messages: () =>
      client
        .post("api/command/")({ action: "messages/optimize" })
        .catch((e) => {
          return Promise.reject(e);
        }),
    Questionnaires: () =>
      client
        .post("api/command/")({ action: "questionnaires/optimize" })
        .catch((e) => {
          return Promise.reject(e);
        }),
    MailImports: () =>
      client
        .post("api/command/")({ action: "mail_imports/import_mails" })
        .catch((e) => {
          return Promise.reject(e);
        }),
  };

  const status = ref<{
    [key: keyof Apps]: "optimizing" | "error" | "success" | "waiting";
  }>({});

  const funcs = computed<{ [key: keyof Apps]: () => Promise<void> }>(() => {
    const d: { [key: keyof Apps]: () => Promise<void> } = {};
    Object.keys(apps).forEach((key) => {
      status.value[key] = "waiting";
      d[key] = () => {
        status.value[key] = "optimizing";
        return apps[key]()
          .then(() => {
            status.value[key] = "success";
          })
          .catch(() => {
            status.value[key] = "error";
          });
      };
    });
    return d;
  });

  const runAll = () => {
    Object.values(funcs.value).reduce(
      (prev, cur) => prev.then(cur),
      Promise.resolve(),
    );
    const userStore = useUserStore();
    userStore.updateSetting("lastOptimization", new Date().valueOf());
  };

  return {
    status,
    runAll,
  };
}
