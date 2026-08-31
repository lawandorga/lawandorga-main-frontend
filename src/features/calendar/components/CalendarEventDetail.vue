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

import CancelOccurrence from "../actions/CancelOccurrence.vue";
import DeleteEvent from "../actions/DeleteEvent.vue";
import UpdateEvent from "../actions/UpdateEvent.vue";
import UpdateOccurrence from "../actions/UpdateOccurrence.vue";
import type { CalendarEvent } from "../api/useCalendarEvents";
import {
  EVENT_SOURCE_META,
  EVENT_TYPE_META,
  RECURRENCE_FREQUENCIES,
  TYPE_TINT_ALPHA,
} from "../constants.js";
import { getEventAccessKind } from "../utils/eventAccess";
import {
  findOverride,
  isRecurring,
  resolveOccurrence,
} from "../utils/occurrences";
import CalendarDetailRow from "./CalendarDetailRow.vue";
import CalendarReminders from "./CalendarReminders.vue";
import EventScopeModal from "./EventScopeModal.vue";

const props = defineProps<{
  modelValue: boolean;
  event: CalendarEvent | null;
  originalStart?: string | null;
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

const hasEditPermission = computed(() => {
  if (!props.event) return false;

  const userId = userStore.user?.id;
  const orgId = userStore.org?.id;
  if (!userId || !orgId) return false;

  if (props.event.creator_id === userId) return true;

  const editTargets = new Set(props.event.edit_grant_targets || []);
  if (editTargets.has(`user:${userId}`)) return true;
  if (editTargets.has(`org:${orgId}`)) return true;

  return (groups.value || []).some(
    (group) =>
      editTargets.has(`group:${group.id}`) && group.members.includes(userId),
  );
});

const canEdit = computed(() => hasEditPermission.value);

const canDelete = computed(() => hasEditPermission.value);

const updateEventRef = ref<InstanceType<typeof UpdateEvent> | null>(null);
const deleteEventRef = ref<InstanceType<typeof DeleteEvent> | null>(null);
const updateOccurrenceRef = ref<InstanceType<typeof UpdateOccurrence> | null>(
  null,
);
const cancelOccurrenceRef = ref<InstanceType<typeof CancelOccurrence> | null>(
  null,
);

const occurrence = computed(() => {
  if (!props.event || !props.originalStart) return null;
  if (!isRecurring(props.event)) return null;
  return resolveOccurrence(
    props.event,
    props.originalStart,
    findOverride(props.event, props.originalStart),
  );
});

const displayed = computed(() => {
  if (!props.event) return null;
  if (occurrence.value) {
    return {
      title: occurrence.value.title,
      start_time: occurrence.value.start,
      end_time: occurrence.value.end,
      location: occurrence.value.location,
      description: occurrence.value.description,
    };
  }
  return {
    title: props.event.title,
    start_time: props.event.start_time,
    end_time: props.event.end_time,
    location: props.event.location,
    description: props.event.description,
  };
});

const sourceMeta = computed(() => {
  const source = props.event ? getEventAccessKind(props.event) : "PERSONAL";
  const meta = EVENT_SOURCE_META[source];
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
  if (!props.event || !displayed.value) return "";
  const { start_time, end_time } = displayed.value;
  const startLabel = toWeekdayDate(start_time);
  if (
    props.event.is_all_day &&
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
  if (!props.event || !displayed.value) return "";
  if (props.event.is_all_day) return "All day";
  const start = formatDate(displayed.value.start_time, false, true);
  if (!displayed.value.end_time) return start;
  return `${start} - ${formatDate(displayed.value.end_time, false, true)}`;
});

const closeDetail = () => {
  emit("update:modelValue", false);
};

const openModal = (modal: { open: () => void } | null) => {
  modal?.open();
  closeDetail();
};

const SCOPE_ACTIONS = {
  edit: {
    title: "Edit repeating event",
    question:
      "Do you want to edit only this event or all events in this series?",
    this: () => openModal(updateOccurrenceRef.value),
    all: () => openModal(updateEventRef.value),
  },
  delete: {
    title: "Delete repeating event",
    question:
      "Do you want to delete only this event or all events in this series?",
    this: () => openModal(cancelOccurrenceRef.value),
    all: () => openModal(deleteEventRef.value),
  },
} as const;

type ScopeAction = keyof typeof SCOPE_ACTIONS;

const scopeModalOpen = ref(false);
const pendingAction = ref<ScopeAction>("edit");

const scopeTitle = computed(() => SCOPE_ACTIONS[pendingAction.value].title);
const scopeQuestion = computed(
  () => SCOPE_ACTIONS[pendingAction.value].question,
);

const askScope = (action: ScopeAction) => {
  if (!occurrence.value) {
    SCOPE_ACTIONS[action].all();
    return;
  }
  pendingAction.value = action;
  scopeModalOpen.value = true;
};

const onEdit = () => askScope("edit");

const onDelete = () => askScope("delete");

const onScopeSelect = (scope: "this" | "all") => {
  SCOPE_ACTIONS[pendingAction.value][scope]();
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

const toGrantTargetLabels = (targets: string[]) => {
  const orgTargets: string[] = [];
  const groupTargets: string[] = [];
  const userTargets: string[] = [];

  for (const target of targets) {
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
};

const viewVisibleTo = computed(() =>
  toGrantTargetLabels(props.event?.view_grant_targets || []),
);

const editVisibleTo = computed(() =>
  toGrantTargetLabels(props.event?.edit_grant_targets || []),
);

const visibleTo = computed(() => {
  const orgs = Array.from(
    new Set([...viewVisibleTo.value.orgs, ...editVisibleTo.value.orgs]),
  );
  const groups = Array.from(
    new Set([...viewVisibleTo.value.groups, ...editVisibleTo.value.groups]),
  );
  const users = Array.from(
    new Set([...viewVisibleTo.value.users, ...editVisibleTo.value.users]),
  );

  return {
    orgs,
    groups,
    users,
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
    :title="displayed?.title ?? ''"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template v-if="event && displayed">
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
          v-if="displayed.location"
          label="Location"
          :icon="MapPinIcon"
        >
          <dd class="text-gray-900">{{ displayed.location }}</dd>
        </CalendarDetailRow>
        <CalendarDetailRow
          v-if="displayed.description"
          label="Description"
          :icon="DocumentTextIcon"
        >
          <dd class="whitespace-pre-wrap text-gray-900">
            {{ displayed.description }}
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

      <div class="mt-5 flex flex-wrap items-center justify-between gap-3">
        <ButtonNormal v-if="canDelete" kind="delete" @click="onDelete">
          Delete
        </ButtonNormal>
        <ButtonNormal v-if="canEdit" kind="action" @click="onEdit">
          Edit
        </ButtonNormal>
      </div>
    </template>
  </ModalFree>

  <template v-if="event">
    <UpdateEvent ref="updateEventRef" :query="query" :event="event" />
    <DeleteEvent
      ref="deleteEventRef"
      :query="query"
      :event-uuid="event.uuid"
      :event-name="event.title"
    />
    <template v-if="occurrence">
      <UpdateOccurrence
        ref="updateOccurrenceRef"
        :query="query"
        :event-uuid="event.uuid"
        :occurrence="occurrence"
      />
      <CancelOccurrence
        ref="cancelOccurrenceRef"
        :query="query"
        :event-uuid="event.uuid"
        :occurrence="occurrence"
      />
    </template>
    <EventScopeModal
      v-model="scopeModalOpen"
      :title="scopeTitle"
      :question="scopeQuestion"
      @select="onScopeSelect"
    />
  </template>
</template>
