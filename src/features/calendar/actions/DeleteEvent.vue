<script setup lang="ts">
import { ModalDelete } from "lorga-ui";
import { computed, toRefs, watch } from "vue";

import useCmd from "@/composables/useCmd";
import { useUserStore } from "@/store/user";

const props = defineProps<{
  query: () => void;
  eventUuid: string;
  eventName: string;
  creatorId: number;
  openSignal?: number;
}>();
const { query, eventUuid, eventName, creatorId, openSignal } = toRefs(props);

const userStore = useUserStore();

const canDelete = computed(() => userStore.user?.id === creatorId.value);

const { commandRequest, commandModalOpen } = useCmd(query.value);

watch(openSignal, (next, prev) => {
  if (next !== undefined && next !== prev && canDelete.value) {
    commandModalOpen.value = true;
  }
});
</script>

<template>
  <ModalDelete
    v-model="commandModalOpen"
    title="Delete Event"
    verb="delete"
    :obj-name="eventName"
    :request="commandRequest"
    :data="{ event_uuid: eventUuid, action: 'calendar/delete_event' }"
  />
</template>
