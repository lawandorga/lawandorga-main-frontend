import useGet2 from "@/composables/useGet2";
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

export interface View {
  uuid: string;
  name: string;
  shared: boolean;
  ordering: number;
  columns: string[];
}

interface InfosData {
  deletions: Deletion[];
  access_requests: AccessRequest[];
  badges: { access_requests: number; deletion_requests: number };
  views: View[];
}

export function useInfos() {
  const data = ref<InfosData>();
  const query = useGet2("/api/records/query/infos/", data);

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

  const views = computed<View[]>(() => {
    if (!data.value) return [];
    return data.value?.views;
  });

  return {
    query,
    deletionRequests,
    accessRequests,
    accessRequestsBadge,
    deletionsBadge,
    views,
  };
}
