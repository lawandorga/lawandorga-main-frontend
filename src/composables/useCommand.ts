import { types } from "@lawandorga/components";
import { ref } from "vue";
import { isFunction } from "lodash";

type VoidFn = () => void;
/* eslint-disable no-unused-vars, @typescript-eslint/no-explicit-any */
type DropFirst<T> = T extends [any, ...infer U] ? U : boolean;
type Combine<T1 extends VoidFn[], K1> = T1 extends (infer T2)[]
  ? K1 extends (infer K2)[]
    ? (T2 | K2)[]
    : never
  : never;
/* eslint-enable */

export default function useCommand<
  /* eslint-disable no-unused-vars, @typescript-eslint/no-explicit-any */
  RFn extends (...args: any[]) => Promise<void | any>,
  /* eslint-enable */
>(requestFunc: RFn, ...params: Combine<VoidFn[], DropFirst<Parameters<RFn>>>) {
  const commandModalOpen = ref(false);

  const commandParams = params.filter((p) => !isFunction(p));
  const queryFunctions = params.filter((p) => isFunction(p)) as VoidFn[];

  const commandRequest = (data: types.JsonModel) => {
    return requestFunc(data, ...commandParams).then((d) => {
      queryFunctions.forEach((qf) => qf());
      commandModalOpen.value = false;
      return d;
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const temporary = ref<{ [key: string]: any } | null>(null);

  return {
    temporary,
    commandRequest,
    commandModalOpen,
  };
}
