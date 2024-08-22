import useGet from "@/composables/useGet";
import useClient from "@/api/client";
import { ref } from "vue";

export interface DashboardInformation {
  members: { id: number; name: string; rlcuserid: number }[] | null;
  changed_records:
    | {
        identifier: string;
        folder_uuid: string;
        updated: string;
        uuid: string;
      }[]
    | null;
  articles:
    | {
        id: number;
        title: string;
        description: string;
        date: Date;
      }[]
    | null;
}

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
