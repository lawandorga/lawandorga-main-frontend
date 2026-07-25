<script setup lang="ts">
import { ModalDelete } from "lorga-ui";
import { toRefs } from "vue";

import useCmd from "@/composables/useCmd";

const props = defineProps<{
  query: () => void;
  eventUuid: string;
  eventName: string;
}>();
const { query, eventUuid, eventName } = toRefs(props);

const { commandRequest, commandModalOpen } = useCmd(query);

defineExpose({
  open: () => {
    commandModalOpen.value = true;
  },
});
</script>

<template>
  <ModalDelete
    v-model="commandModalOpen"
    title="Delete Event"
    :obj-name="eventName"
    :request="commandRequest"
    :data="{ event_uuid: eventUuid, action: 'calendar/delete_event' }"
  />
</template>
