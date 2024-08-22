import useGet from "@/composables/useGet";
import useClient from "@/api/client";
import { ref } from "vue";

export interface DashboardInformation {}

export function useDashboard() {
  const client = useClient();

  const data = ref<DashboardInformation | null>(null);

  const request = client.get<DashboardInformation>(
    "api/auth/query/page/dashboard/",
  );

  useGet(request, data);

  return {
    data,
  };
}
