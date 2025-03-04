import { ref, computed } from "vue";
import useGet from "@/composables/useGet";
import useClient from "@/api/client";

export interface OrgUser {
  id: number;
  user_id: number;
  birthday: string;
  phone_number: string;
  street: string;
  city: string;
  postal_code: string;
  locked: boolean;
  locked_legal: boolean;
  email_confirmed: boolean;
  is_active: boolean;
  accepted: boolean;
  updated: string;
  note: string;
  name: string;
  email: string;
  created: string;
  speciality_of_study: string | null;
  speciality_of_study_display: string | null;
}

interface HasPermission {
  id: number;
  permission_name: string;
  source: string;
  group_name: string;
  user_name: string;
  group_id: number;
}

interface Data {
  user: OrgUser;
  permissions: HasPermission[] | null;
}

export function useProfileData(id: string) {
  const data = ref<Data | null>(null);

  const user = computed<OrgUser | null>(() => {
    if (!data.value) return null;
    return data.value.user;
  });

  const permissions = computed<HasPermission[] | null>(() => {
    if (!data.value) return null;
    return data.value.permissions;
  });

  const client = useClient();
  const request = client.get("/api/org_users/{}/", id);
  const query = useGet(request, data);

  return {
    user,
    permissions,
    query,
  };
}
