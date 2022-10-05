import { types } from "@lawandorga/components";
import { ref, Ref, unref } from "vue";
import { isFunction } from "lodash";

type Nullable<T> = T extends (infer U)[]
  ? Array<U | Ref<U | null> | null>
  : never;

export default function useCommand<
  /* eslint-disable no-unused-vars, @typescript-eslint/no-explicit-any */
  Type extends { [key: string]: any; id: number | string },
  CFn extends (...args: any[]) => Promise<void>,
  VFn extends (...args: any[]) => void,
  /* eslint-enable */
>(commandFunc: CFn, ...params: Nullable<Parameters<CFn>> | VFn[]) {
  const commandModalOpen = ref(false);

  const commandParams = params.filter((p) => !isFunction(p));
  const queryFunctions = params.filter((p) => isFunction(p));

  const commandRequest = (data: types.JsonModel) => {
    return commandFunc(data, ...commandParams.map(unref)).then(() => {
      queryFunctions.forEach((qf) => qf());
      commandModalOpen.value = false;
    });
  };

  const temporary = ref<Type | null>(null);

  return {
    temporary,
    commandRequest,
    commandModalOpen,
  };
}