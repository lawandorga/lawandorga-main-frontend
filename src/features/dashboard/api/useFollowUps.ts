import { ref } from "vue";

import useGet2 from "@/composables/useGet2";

interface FollowUpEvent {
  time: string;
  title: string;
  folder_uuid: string;
}

export function useFollowUps() {
  const followUps = ref<FollowUpEvent[] | null>();
  useGet2("/api/timeline/query/dashboard/", followUps);

  return {
    followUps,
  };
}
