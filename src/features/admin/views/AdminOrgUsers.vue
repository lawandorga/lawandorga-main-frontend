<script lang="ts" setup>
import { computed, ref } from "vue";
import BoxLoader from "@/components/BoxLoader.vue";
import ActivityBadge from "@/components/ActivityBadge.vue";
import { TableSortable } from "lorga-ui";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { CogIcon } from "@heroicons/vue/24/outline";
import ButtonLink from "@/components/ButtonLink.vue";
import UsersDeleteUser from "@/features/admin/actions/DeleteUser.vue";
import UsersActivateDeactivateUser from "@/features/admin/actions/ActivateDeactivateUser.vue";
import UsersAcceptUser from "@/features/admin/actions/AcceptOrgUser.vue";
import UsersUnlockUser from "@/features/admin/actions/UnlockUser.vue";
import { useProfiles, type ActivityState } from "../api/useProfiles";

const { profiles, query } = useProfiles();

type FilterOption = ActivityState | "all";

const activityFilter = ref<FilterOption>("all");

const filterOptions = [
  {
    label: "All",
    value: "all" as FilterOption,
    activeClasses: "bg-gray-800 text-white border-gray-800",
    inactiveClasses:
      "bg-white text-gray-700 border-gray-300 hover:border-gray-500",
  },
  {
    label: "Active (3 mo.)",
    value: "green" as FilterOption,
    activeClasses: "bg-green-100 text-green-800 border-green-500",
    inactiveClasses:
      "bg-white text-green-800 border-green-200 hover:border-green-400",
  },
  {
    label: "Active (6 mo.)",
    value: "yellow" as FilterOption,
    activeClasses: "bg-yellow-100 text-yellow-800 border-yellow-500",
    inactiveClasses:
      "bg-white text-yellow-800 border-yellow-200 hover:border-yellow-400",
  },
  {
    label: "Logged in (6 mo.)",
    value: "orange" as FilterOption,
    activeClasses: "bg-orange-100 text-orange-800 border-orange-500",
    inactiveClasses:
      "bg-white text-orange-800 border-orange-200 hover:border-orange-400",
  },
  {
    label: "Inactive (12+ mo.)",
    value: "red" as FilterOption,
    activeClasses: "bg-red-100 text-red-800 border-red-500",
    inactiveClasses:
      "bg-white text-red-800 border-red-200 hover:border-red-400",
  },
];

function toggleFilter(value: FilterOption) {
  activityFilter.value = activityFilter.value === value ? "all" : value;
}

const filteredProfiles = computed(() => {
  if (!profiles.value) return null;
  if (activityFilter.value === "all") return profiles.value;
  return profiles.value.filter(
    (profile) => profile.activity_state === activityFilter.value,
  );
});

const activityOrder: Record<ActivityState, number> = {
  green: 1,
  yellow: 2,
  orange: 3,
  red: 4,
};

function getSortValue(
  item: Record<string, unknown>,
  key: string,
): string | number {
  if (key === "activity_state")
    return activityOrder[item.activity_state as ActivityState] ?? 0;
  const value = item[key];
  return typeof value === "string" || typeof value === "number" ? value : "";
}
</script>

<template>
  <BoxLoader show>
    <div class="max-w-(--breakpoint-xl) mx-auto space-y-6">
      <BreadcrumbsBar
        class="lg:col-span-2"
        :base="{ name: 'admin-dashboard' }"
        :pages="[{ name: 'Profiles', to: { name: 'admin-profiles' } }]"
      >
        <CogIcon class="w-6 h-6" />
      </BreadcrumbsBar>

      <div
        class="flex items-center gap-2"
        role="group"
        aria-labelledby="activity-filter-label"
      >
        <span
          id="activity-filter-label"
          class="text-sm font-medium text-gray-700"
        >
          Activity:
        </span>
        <div class="flex flex-wrap gap-1">
          <button
            v-for="option in filterOptions"
            :key="option.value"
            type="button"
            :aria-pressed="activityFilter === option.value"
            :class="[
              'px-3 py-1 text-sm rounded-full border transition-colors',
              activityFilter === option.value
                ? option.activeClasses
                : option.inactiveClasses,
            ]"
            @click="toggleFilter(option.value)"
          >
            {{ option.label }}
          </button>
        </div>
      </div>

      <TableSortable
        v-if="filteredProfiles?.length !== 0"
        sort-key="activity_state"
        sort-order="ASC"
        :get-value-func="getSortValue"
        :head="[
          { name: 'Name', key: 'name', sortable: true },
          { name: 'E-Mail', key: 'email' },
          { name: 'Phone', key: 'phone_number' },
          { name: 'Groups', key: 'group_names' },
          { name: 'Last Login', key: 'last_login_month', sortable: true },
          { name: 'Activity', key: 'activity_state', sortable: true },
          { name: '', key: 'action' },
        ]"
        :data="filteredProfiles"
      >
        <template #group_names="{ item }">
          {{ item.group_names.join(", ") }}
        </template>
        <template #name="{ item }">
          <div class="flex items-center space-x-1">
            <ButtonLink
              :to="{
                name: 'admin-profile',
                params: { id: item.id },
              }"
            >
              <span class="whitespace-nowrap">
                {{ item.name }}
              </span>
            </ButtonLink>
            <template
              v-for="qualification in item.qualifications"
              :key="qualification"
            >
              <span
                class="inline-flex items-center px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full"
              >
                {{ qualification }}
              </span>
            </template>
          </div>
        </template>
        <template #activity_state="{ item }">
          <ActivityBadge :state="item.activity_state" />
        </template>
        <template #action="{ item }">
          <UsersAcceptUser
            :query="query"
            :user-name="item.name"
            :user-id="item.id"
            :user-accepted="item.accepted"
          />
          <UsersUnlockUser
            :query="query"
            :user-name="item.name"
            :user-id="item.id"
            :user-locked="item.locked"
          />
          <UsersActivateDeactivateUser
            :query="query"
            :user-name="item.name"
            :user-id="item.id"
            :user-active="item.is_active"
          />
          <UsersDeleteUser
            :query="query"
            :user-name="item.name"
            :user-id="item.id"
          />
        </template>
      </TableSortable>
      <div v-else class="py-10 text-sm text-center text-gray-500">
        No users match the selected activity filter.
      </div>
    </div>
  </BoxLoader>
</template>
