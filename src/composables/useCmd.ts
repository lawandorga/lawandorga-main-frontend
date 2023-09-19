import { Ref } from "vue";
import useClient from "@/api/client";
import useCommand from "./useCommand";

type VoidFn = () => void;

export default function useCmd(...queries: (VoidFn | Ref<VoidFn>)[]): {
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-explicit-any
  commandRequest: (data: any) => Promise<any>;
  commandModalOpen: Ref<boolean>;
} {
  const client = useClient();
  const request = client.post("/api/command/");

  return useCommand(request, queries);
}
