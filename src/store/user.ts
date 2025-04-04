import { defineStore } from "pinia";
import { ref, computed } from "vue";
import useClient from "@/api/client";
import useCmd from "@/composables/useCmd";

interface OrgUser {
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

interface BadgeInformation {
  profiles: number;
  record_deletion_requests: number;
  record_permit_requests: number;
  legal: number;
  record?: number;
}

type Settings = Record<string, string | boolean>;

interface Link {
  id: string;
  name: string;
  link: string;
  order: number;
}

interface Org {
  id: number;
  name: string;
  use_record_pool: boolean;
  links: Link[];
  disable_files: boolean;
  is_events_enabled: boolean;
  is_chat_enabled: boolean;
  is_mail_enabled: boolean;
}

interface DataResponse {
  user: OrgUser;
  org: Org;
  permissions: string[];
  badges: BadgeInformation;
  settings: Settings;
}

export const useUserStore = defineStore("user", () => {
  const org = ref<Org>();

  const user = ref<OrgUser>();

  const permissions = ref<string[]>();

  const badges = ref<BadgeInformation>();
  const adminBadges = computed(() => {
    if (badges.value === undefined) return 0;
    return badges.value["profiles"];
  });

  const recordBadges = computed(() => {
    if (badges.value === undefined) return 0;
    return badges.value["record"] || 0;
  });

  const settings = ref<Settings>();

  const setData = (data: DataResponse) => {
    org.value = data.org;
    user.value = data.user;
    badges.value = data.badges;
    settings.value = data.settings;
    permissions.value = data.permissions;
  };

  const client = useClient();
  const request = client.get("api/auth/org_users/data_self/");

  const updateData = () => {
    return request()
      .then((r) => setData(r))
      .catch(() => {
        /* ignore */
      });
  };

  const updatePossible = ref(true);

  const { commandRequest } = useCmd();

  const updateSettingRequest = () => {
    if (updatePossible.value) {
      updatePossible.value = false;
      commandRequest({
        action: "auth/update_frontend_settings",
        data: "||JSON||".concat(JSON.stringify(settings.value || {})),
      }).then(() => (updatePossible.value = true));
    } else {
      setTimeout(() => updateSettingRequest(), 500);
    }
  };

  const updateSetting = (
    key: string,
    value: string | boolean | number | string[],
  ) => {
    const newSettings = Object.assign({}, settings.value, { [key]: value });
    settings.value = newSettings;
    updateSettingRequest();
  };

  const getSetting = <T = string | boolean | number | string[]>(
    key: string,
    defaultValue: T = "" as T,
  ) => {
    if (settings.value && key in settings.value) return settings.value[key];
    return defaultValue;
  };

  const loaded = computed(() => {
    return !!org.value && !!user.value;
  });

  const locked = computed(() => {
    return user.value?.locked;
  });

  const isAuthenticated = computed(() => {
    return !!user.value;
  });

  const hasPermission = (permission: string): boolean => {
    return !!permissions.value?.includes(permission);
  };

  const reset = () => {
    org.value = undefined;
    user.value = undefined;
    badges.value = undefined;
    settings.value = undefined;
    permissions.value = undefined;
  };

  return {
    org,
    user,
    badges,
    adminBadges,
    recordBadges,
    isAuthenticated,
    settings,
    loaded,
    locked,
    hasPermission,
    updateData,
    updateSetting,
    getSetting,
    reset,
  };
});
