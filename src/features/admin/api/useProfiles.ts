import { computed, ref, Ref, unref, watch } from "vue";

import useQuery2 from "@/composables/useQuery2";

export type ActivityState = "green" | "yellow" | "orange" | "red";

export interface OrgUserSmall {
  id: number;
  uuid: string;
  user_id: number;
  phone_number: string | null;
  group_names: string[];
  name: string;
  email: string;
  accepted: boolean;
  email_confirmed: boolean;
  locked: boolean;
  is_active: boolean;
  qualifications: string[];
  activity_state: ActivityState;
}

export function useProfiles({
  doQuery = ref(true),
}: { doQuery?: Ref<boolean> } = {}) {
  const profiles = ref<OrgUserSmall[]>();

  const formProfiles = computed(() => {
    if (!profiles.value) return [];
    return profiles.value.map((profile) => ({
      name: profile.name,
      value: profile.id,
    }));
  });

  const formProfilesUuid = computed(() => {
    if (!profiles.value) return [];
    return profiles.value.map((profile) => ({
      name: profile.name,
      value: profile.uuid,
    }));
  });

  const query = useQuery2("api/auth/org_users/", profiles);
  watch(
    doQuery,
    () => {
      if (doQuery.value) {
        query();
      }
    },
    { immediate: true },
  );

  return {
    profiles,
    formProfiles,
    formProfilesUuid,
    query,
  };
}
