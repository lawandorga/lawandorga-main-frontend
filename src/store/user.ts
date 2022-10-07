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

export const useUserStore = defineStore("user", () => {
  const rlc = ref<Rlc>();

  const user = ref<RlcUser>();

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
  };

  const updateData = () => {
    UserService.data().then((r) => setData(r));
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

  const updateSetting = (key: string, value: string) => {
    const newSettings = Object.assign({}, settings.value, { [key]: value });
    settings.value = newSettings;
    updateSettingRequest();
  };

  const getSetting = (key: string, defaultValue: string | boolean = "") => {
    if (settings.value && key in settings.value) return settings.value[key];
    return defaultValue;
  };

  const loaded = computed(() => {
    return !!rlc.value && !!user.value;
  });

  const locked = computed(() => {
    return user.value?.locked;
  });

  const reset = () => {
    rlc.value = undefined;
    user.value = undefined;
    badges.value = undefined;
    settings.value = undefined;
  };

  return {
    rlc,
    user,
    badges,
    adminBadges,
    settings,
    loaded,
    locked,
    updateData,
    updateSetting,
    getSetting,
    reset,
  };
});
