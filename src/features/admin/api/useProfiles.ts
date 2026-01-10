import { computed, ref, Ref } from "vue";
import useGet2 from "@/composables/useGet2";

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
}

export function useProfiles() {
  const profiles = ref(null) as Ref<OrgUserSmall[] | null>;

  const query = useGet2("api/auth/org_users/", profiles);

  const formProfiles = computed(() => {
    if (!profiles.value) return [];
    return profiles.value.map((profile) => ({
      name: profile.name,
      value: profile.id,
    }));
  });

  return {
    profiles,
    formProfiles,
    query,
  };
}
