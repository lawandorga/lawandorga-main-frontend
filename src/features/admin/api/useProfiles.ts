import useGet from "@/composables/useGet";
import useClient from "@/api/client";
import { ref, Ref } from "vue";

export interface RlcUserSmall {
  id: number;
  user_id: number;
  phone_number: string | null;
  name: string;
  email: string;
  accepted: boolean;
  email_confirmed: boolean;
  locked: boolean;
  is_active: boolean;
}

export function useProfiles() {
  const profiles = ref(null) as Ref<RlcUserSmall[] | null>;

  const client = useClient();
  const request = client.get("api/rlc_users/");
  const query = useGet(request, profiles);

  return {
    profiles,
    query,
  };
}
