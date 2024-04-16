import useClient from "@/api/client";
import useGet from "@/composables/useGet";
import { computed, ref } from "vue";

interface Deletion {
  requested_by_detail: string;
  record_detail: string;
  processed_by_detail: string;
  uuid: string;
  processed: string;
  state: string;
  explanation: string;
  created: string;
}

interface AccessRequest {
  requested_by_detail: string;
  record_detail: string;
  processed_by_detail: string;
  uuid: string;
  processed_on: string;
  state: string;
  created: string;
  updated: string;
}

interface InfosData {
  deletions: Deletion[];
  access_requests: AccessRequest[];
  badges: { access_requests: number; deletion_requests: number };
}

export function useInfos() {
  const client = useClient();
  const request = client.get("/api/records/query/infos/");

  const data = ref<InfosData>();
  const query = useGet(request, data);

  const deletionRequests = computed<Deletion[]>(() => {
    if (!data.value) return [];
    return data.value.deletions;
  });

  const accessRequests = computed<AccessRequest[]>(() => {
    if (!data.value) return [];
    return data.value.access_requests;
  });

  const accessRequestsBadge = computed<number>(() => {
    if (!data.value) return 0;
    return data.value.badges.access_requests;
  });

  const deletionsBadge = computed<number>(() => {
    if (!data.value) return 0;
    return data.value.badges.deletion_requests;
  });

  return {
    query,
    deletionRequests,
    accessRequests,
    accessRequestsBadge,
    deletionsBadge,
  };
}
