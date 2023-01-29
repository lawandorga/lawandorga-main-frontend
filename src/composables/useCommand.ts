import { types } from "@lawandorga/components";
import { Ref, ref, unref } from "vue";
import { isFunction } from "lodash";
import { Reffed } from "@/types/shared";
import { useErrorHandling } from "@/api/errors";

type VoidFn = () => void;
/* eslint-disable no-unused-vars, @typescript-eslint/no-explicit-any */
type DropFirst<T extends unknown[]> = T extends [any, ...infer U] ? U : never;
/* eslint-enable */

export default function useCommand<
  /* eslint-disable no-unused-vars, @typescript-eslint/no-explicit-any */
  RFn extends (...args: any[]) => Promise<void | any>,
  /* eslint-enable */
>(
  requestFunc: RFn,
  queries: VoidFn[] | VoidFn = [],
  ...params: Reffed<DropFirst<Parameters<RFn>>>
): {
  /* eslint-disable no-unused-vars, @typescript-eslint/no-explicit-any */
  temporary: Ref<{ [key: string]: any } | null>;
  commandRequest: (data: types.JsonModel) => Promise<any>;
  /* eslint-enable */
  commandModalOpen: Ref<boolean>;
} {
  const commandModalOpen = ref(false);

  const commandParams = params.filter((p) => !isFunction(p));
  const queryFunctions = Array.isArray(queries) ? queries : [queries];

  const { handleCommandError } = useErrorHandling();

  const commandRequest = (data: types.JsonModel) => {
    return requestFunc(data, ...commandParams.map(unref))
      .then((d) => {
        queryFunctions.forEach((qf) => qf());
        commandModalOpen.value = false;
        return d;
      })
      .catch(handleCommandError);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const temporary = ref<{ [key: string]: any } | null>(null);

  return {
    temporary,
    commandRequest,
    commandModalOpen,
  };
}
