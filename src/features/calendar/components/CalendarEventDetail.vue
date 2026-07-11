<script setup lang="ts">
import {
  ArrowPathIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  MapPinIcon,
  UserIcon,
  UserGroupIcon,
} from "@heroicons/vue/24/outline";
import { ButtonNormal, ModalFree } from "lorga-ui";
import { computed, ref, watch } from "vue";

import { useProfiles } from "@/features/admin/api/useProfiles";
import { useGroups } from "@/features/org/api/useGroups";
import { useUserStore } from "@/store/user";
import { formatDate } from "@/utils/date.js";

import DeleteEvent from "../actions/DeleteEvent.vue";
import UpdateEvent from "../actions/UpdateEvent.vue";
import type { CalendarEvent } from "../api/useCalendarEvents";
import {
  EVENT_SOURCE_META,
  EVENT_TYPE_META,
  RECURRENCE_FREQUENCIES,
  TYPE_TINT_ALPHA,
} from "../constants.js";
import CalendarDetailRow from "./CalendarDetailRow.vue";
import CalendarReminders from "./CalendarReminders.vue";

const props = defineProps<{
  modelValue: boolean;
  event: CalendarEvent | null;
  query: () => void;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();

const eventTypeMeta = computed(() => EVENT_TYPE_META[props.event!.event_type]);

const eventColor = computed(() => eventTypeMeta.value.color);

const userStore = useUserStore();
const { profiles, query: queryProfiles } = useProfiles();
const { groups, query: queryGroups } = useGroups();

const canEdit = computed(
  () => !!props.event && userStore.user?.id === props.event.creator_id,
);

const canDelete = computed(
  () => !!props.event && userStore.user?.id === props.event.creator_id,
);

const updateOpenSignal = ref(0);
const deleteOpenSignal = ref(0);

const sourceMeta = computed(() => {
  // TODO: use actual source
  const meta = EVENT_SOURCE_META.PERSONAL;
  return {
    label: meta.label,
    style: {
      backgroundColor: `${meta.color}22`,
      color: meta.color,
      border: `1px solid ${meta.color}44`,
    },
  };
});

const toWeekdayDate = (value: string): string => {
  const weekday = new Date(value).toLocaleDateString("en-GB", {
    weekday: "long",
  });
  return `${weekday}, ${formatDate(value, true)}`;
};

const formattedDate = computed(() => {
  if (!props.event) return "";
  const { start_time, end_time, is_all_day } = props.event;
  const startLabel = toWeekdayDate(start_time);
  if (
    is_all_day &&
    end_time &&
    formatDate(start_time, true) !== formatDate(end_time, true)
  ) {
    return `${startLabel} - ${toWeekdayDate(end_time)}`;
  }
  return startLabel;
});

const recurrenceLabel = computed(() => {
  if (!props.event) return "";
  const frequency = RECURRENCE_FREQUENCIES.find(
    (option) => option.rule === props.event!.recurrence_rule,
  );
  if (!frequency) return "";
  if (props.event.recurrence_until) {
    return `${frequency.label}, until ${formatDate(props.event.recurrence_until, true)}`;
  }
  return frequency.label;
});

const formattedTime = computed(() => {
  if (!props.event) return "";
  if (props.event.is_all_day) return "All day";
  const start = formatDate(props.event.start_time, false, true);
  if (!props.event.end_time) return start;
  return `${start} - ${formatDate(props.event.end_time, false, true)}`;
});

const closeDetail = () => {
  emit("update:modelValue", false);
};

const openUpdateModal = () => {
  updateOpenSignal.value += 1;
  closeDetail();
};

const openDeleteModal = () => {
  deleteOpenSignal.value += 1;
  closeDetail();
};

watch(
  () => props.modelValue,
  (isOpen) => {
    if (!isOpen) return;
    queryProfiles();
    queryGroups();
  },
);

const userNameById = computed(() => {
  const map = new Map<number, string>();
  for (const profile of profiles.value || []) {
    map.set(profile.id, profile.name);
  }
  return map;
});

const groupNameById = computed(() => {
  const map = new Map<number, string>();
  for (const group of groups.value || []) {
    map.set(group.id, group.name);
  }
  return map;
});

const visibleTo = computed(() => {
  const orgTargets: string[] = [];
  const groupTargets: string[] = [];
  const userTargets: string[] = [];

  for (const target of props.event?.grant_targets || []) {
    const [rawType, rawId] = target.split(":");
    const id = Number(rawId);

    if (rawType === "org") {
      orgTargets.push(userStore.org?.name || "Organization");
      continue;
    }

    if (rawType === "group") {
      const groupName = groupNameById.value.get(id);
      groupTargets.push(groupName || `Group #${rawId}`);
      continue;
    }

    if (rawType === "user") {
      const userName = userNameById.value.get(id);
      userTargets.push(userName || `User #${rawId}`);
    }
  }

  return {
    orgs: Array.from(new Set(orgTargets)),
    groups: Array.from(new Set(groupTargets)),
    users: Array.from(new Set(userTargets)),
  };
});

const invitedUsers = computed(() =>
  Array.from(new Set(props.event?.guest_user_names || [])),
);

const hasVisibilityDetails = computed(
  () =>
    visibleTo.value.orgs.length > 0 ||
    visibleTo.value.groups.length > 0 ||
    visibleTo.value.users.length > 0 ||
    invitedUsers.value.length > 0,
);
</script>

<template>
  <ModalFree
    :model-value="modelValue"
    :title="event?.title ?? ''"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template v-if="event">
      <div class="mb-5 flex gap-2">
        <span
          class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
          :style="{
            backgroundColor: `${eventColor}${TYPE_TINT_ALPHA}`,
            color: eventColor,
          }"
        >
          <span
            class="h-1.5 w-1.5 shrink-0 rounded-full"
            :style="{ backgroundColor: eventColor }"
          />
          {{ eventTypeMeta.label }}
        </span>
        <span
          class="rounded-full px-2.5 py-1 text-xs font-medium"
          :style="sourceMeta.style"
        >
          {{ sourceMeta.label }}
        </span>
      </div>

      <dl class="space-y-3 text-sm">
        <CalendarDetailRow label="Date" :icon="CalendarDaysIcon">
          <div>
            <dd class="text-gray-900">{{ formattedDate }}</dd>
            <dd class="text-gray-500">{{ formattedTime }}</dd>
          </div>
        </CalendarDetailRow>
        <CalendarDetailRow
          v-if="event.location"
          label="Location"
          :icon="MapPinIcon"
        >
          <dd class="text-gray-900">{{ event.location }}</dd>
        </CalendarDetailRow>
        <CalendarDetailRow
          v-if="event.description"
          label="Description"
          :icon="DocumentTextIcon"
        >
          <dd class="whitespace-pre-wrap text-gray-900">
            {{ event.description }}
          </dd>
        </CalendarDetailRow>
        <CalendarDetailRow
          v-if="recurrenceLabel"
          label="Repeats"
          :icon="ArrowPathIcon"
        >
          <dd class="text-gray-900">{{ recurrenceLabel }}</dd>
        </CalendarDetailRow>
        <CalendarDetailRow label="Creator" :icon="UserIcon">
          <dd class="text-gray-900">{{ event.creator_name }}</dd>
        </CalendarDetailRow>
        <CalendarDetailRow
          v-if="hasVisibilityDetails"
          label="Visible To"
          :icon="UserGroupIcon"
        >
          <div class="space-y-1">
            <dd v-if="visibleTo.orgs.length" class="text-gray-900">
              Org: {{ visibleTo.orgs.join(", ") }}
            </dd>
            <dd v-if="visibleTo.groups.length" class="text-gray-900">
              Groups: {{ visibleTo.groups.join(", ") }}
            </dd>
            <dd v-if="visibleTo.users.length" class="text-gray-900">
              Users: {{ visibleTo.users.join(", ") }}
            </dd>
          </div>
        </CalendarDetailRow>
      </dl>

      <div class="mt-5 border-t border-gray-100 pt-5">
        <CalendarReminders :event="event" :query="query" />
      </div>

      <div class="mt-5 flex items-center justify-between gap-3">
        <ButtonNormal
          v-if="canDelete"
          kind="delete"
          class="mr-auto"
          @click="openDeleteModal"
        >
          Delete
        </ButtonNormal>
        <ButtonNormal v-if="canEdit" kind="action" @click="openUpdateModal">
          Edit
        </ButtonNormal>
      </div>
    </template>
  </ModalFree>

  <template v-if="event">
    <UpdateEvent
      :query="query"
      :event-uuid="event.uuid"
      :event-title="event.title"
      :event-type="event.event_type"
      :start-time="event.start_time"
      :end-time="event.end_time"
      :is-all-day="event.is_all_day"
      :location="event.location"
      :description="event.description"
      :recurrence-rule="event.recurrence_rule"
      :recurrence-until="event.recurrence_until"
      :grant-targets="event.grant_targets"
      :creator-id="event.creator_id"
      :open-signal="updateOpenSignal"
    />
    <DeleteEvent
      :query="query"
      :event-uuid="event.uuid"
      :event-name="event.title"
      :creator-id="event.creator_id"
      :open-signal="deleteOpenSignal"
    />
  </template>
</template>
