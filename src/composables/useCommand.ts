import { Ref, ref, unref } from "vue";
import { useErrorHandling } from "@/api/errors";

type VoidFn = () => void;

export default function useCommand<
  /* eslint-disable no-unused-vars, @typescript-eslint/no-explicit-any */
  RFn extends (...args: any[]) => Promise<void | any>,
  /* eslint-enable */
>(
  requestFunc: RFn,
  queries: (VoidFn | Ref<VoidFn>)[] | VoidFn = [],
): {
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-explicit-any
  commandRequest: (data: Record<string, any>) => Promise<any>;
  commandModalOpen: Ref<boolean>;
} {
  const commandModalOpen = ref(false);

  const queryFunctions = Array.isArray(queries) ? queries : [queries];

  const { handleCommandError } = useErrorHandling();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const commandRequest = (data: Record<string, any>) => {
    return requestFunc(data)
      .then((d) => {
        queryFunctions.forEach((qf) => unref(qf)());
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
