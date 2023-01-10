import { Rlc } from "@/types/core";
import {
  BadgeInformation,
  DataResponse,
  RlcUser,
  Settings,
} from "@/types/user";
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import UserService from "@/services/user";
import * as Sentry from "@sentry/vue";

export const useUserStore = defineStore("user", () => {
  const rlc = ref<Rlc>();

  const user = ref<RlcUser>();

  const permissions = ref<string[]>();

  const badges = ref<BadgeInformation>();
  const adminBadges = computed(() => {
    if (badges.value === undefined) return 0;
    return (
      Object.entries(badges.value).reduce(
        (prev, [, value]) => prev + value,
        0,
      ) - (badges.value["legal"] || 0)
    );
  });

  const settings = ref<Settings>();

  const setData = (data: DataResponse) => {
    rlc.value = data.rlc;
    user.value = data.user;
    badges.value = data.badges;
    settings.value = data.settings;
    permissions.value = data.permissions;
    Sentry.setUser({
      email: data.user.email,
      name: data.user.name,
      id: `${data.user.user_id}`,
    });
  };

  const updateData = () => {
    return UserService.data()
      .then((r) => setData(r))
      .catch(() => {
        /* ignore */
      });
  };

  const updatePossible = ref(true);

  const updateSettingRequest = () => {
    if (updatePossible.value) {
      updatePossible.value = false;
      UserService.updateSettings(settings.value || {}).then(
        () => (updatePossible.value = true),
      );
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

  const getSetting = (
    key: string,
    defaultValue: string | boolean | number | string[] = "",
  ) => {
    if (settings.value && key in settings.value) return settings.value[key];
    return defaultValue;
  };

  const loaded = computed(() => {
    return !!rlc.value && !!user.value;
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
    rlc.value = undefined;
    user.value = undefined;
    badges.value = undefined;
    settings.value = undefined;
    permissions.value = undefined;
    Sentry.setUser(null);
  };

  const logout = () => {
    UserService.logout().then(() => {
      reset();
    });
  };

  return {
    rlc,
    user,
    badges,
    adminBadges,
    isAuthenticated,
    settings,
    loaded,
    locked,
    hasPermission,
    updateData,
    updateSetting,
    getSetting,
    reset,
    logout,
  };
});
