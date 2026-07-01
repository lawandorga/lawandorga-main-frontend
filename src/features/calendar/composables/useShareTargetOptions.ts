import { types } from "lorga-ui";
import { computed } from "vue";

import { useProfiles } from "@/features/admin/api/useProfiles";
import { useGroups } from "@/features/org/api/useGroups";
import { useUserStore } from "@/store/user";

import { getGrantTargetKey } from "../utils/shareTargets";

export default function useShareTargetOptions() {
  const { formProfiles, query: queryProfiles } = useProfiles();
  const { groups, query: queryGroups } = useGroups();
  const userStore = useUserStore();

  const shareTargetOptions = computed<types.FormOptionInput[]>(() => [
    ...(userStore.org
      ? [
          {
            name: userStore.org.name,
            value: getGrantTargetKey("org", userStore.org.id),
          },
        ]
      : []),
    ...formProfiles.value.map((profile) => ({
      name: `User: ${profile.name}`,
      value: getGrantTargetKey("user", Number(profile.value)),
    })),
    ...(groups.value || []).map((group) => ({
      name: `Group: ${group.name}`,
      value: getGrantTargetKey("group", group.id),
    })),
  ]);

  const loadShareTargetOptions = () => {
    queryProfiles();
    queryGroups();
  };

  return {
    shareTargetOptions,
    loadShareTargetOptions,
  };
}
