import { computed, ref, Ref } from "vue";

import useGet2 from "@/composables/useGet2";

export type ActivityState = "green" | "yellow" | "orange" | "red";

export interface OrgUserSmall {
  id: number;
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

const profiles = ref(null) as Ref<OrgUserSmall[] | null>;

const formProfiles = computed(() => {
  if (!profiles.value) return [];
  return profiles.value.map((profile) => ({
    name: profile.name,
    value: profile.id,
  }));
});

let profilesQuery: (() => void) | null = null;

export function useProfiles() {
  if (!profilesQuery) profilesQuery = useGet2("api/auth/org_users/", profiles);

  return {
    profiles,
    formProfiles,
    query: profilesQuery,
  };
}
