import useGet from "@/composables/useGet";
import useClient from "@/api/client";
import { ref } from "vue";

export interface DashboardInformation {
  records:
    | { identifier: string; folder_uuid: string; state: string; uuid: string }[]
    | null;
  members: { id: number; name: string; rlcuserid: number }[] | null;
  questionnaires:
    | {
        name: string;
        folder_uuid: string;
      }[]
    | null;
  changed_records:
    | {
        identifier: string;
        folder_uuid: string;
        updated: string;
        uuid: string;
      }[]
    | null;
  follow_ups:
    | {
        folder_uuid: string;
        title: string;
        time: string;
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
