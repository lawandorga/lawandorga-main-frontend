import { types } from "lorga-ui";
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
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-explicit-any
  commandRequest: (data: Record<string, any>) => Promise<any>;
  commandModalOpen: Ref<boolean>;
} {
  const commandModalOpen = ref(false);

  const commandParams = params.filter((p) => !isFunction(p));
  const queryFunctions = Array.isArray(queries) ? queries : [queries];

  const { handleCommandError } = useErrorHandling();

  const commandRequest = (data: Record<string, any>) => {
    return requestFunc(data, ...commandParams.map(unref))
      .then((d) => {
        queryFunctions.forEach((qf) => qf());
        commandModalOpen.value = false;
        return d;
      })
      .catch(handleCommandError);
  };

  return {
    commandRequest,
    commandModalOpen,
  };
}
