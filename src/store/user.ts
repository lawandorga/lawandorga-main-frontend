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
    return Object.entries(badges.value || {}).reduce(
      (prev, [, value]) => prev + value,
      0,
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

  const updateSettings = (key: string, value: string) => {
    const newSettings = Object.assign({}, settings.value, { [key]: value });
    UserService.updateSettings(newSettings).then(
      () => (settings.value = newSettings),
    );
  };

  const loaded = computed(() => {
    return !!rlc.value && !!user.value;
  });

  const locked = computed(() => {
    return user.value?.locked;
  });

  return {
    rlc,
    user,
    badges,
    adminBadges,
    settings,
    loaded,
    locked,
    updateData,
    updateSettings,
  };
});
