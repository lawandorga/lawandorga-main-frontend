import { computed, ref } from "vue";

import useClient from "@/api/client";
import { useUserStore } from "@/store/user";

export interface Apps {
  [key: string]: () => Promise<unknown>;
}

export function useRunOptimizations() {
  const client = useClient();

  const apps: Apps = {
    Encryption: () =>
      client
        .post("api/command/")({ action: "encryption/optimize" })
        .catch((e) => {
          return Promise.reject(e);
        }),
    Records: () =>
      client
        .post("api/command/")({ action: "data_sheets/optimize" })
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

  const funcs = computed<{ [key: keyof Apps]: () => Promise<unknown> }>(() => {
    const d: { [key: keyof Apps]: () => Promise<unknown> } = {};
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
    Object.values(funcs.value).reduce<Promise<unknown>>(
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
