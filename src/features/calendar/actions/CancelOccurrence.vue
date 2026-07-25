<script setup lang="ts">
import { ModalDelete } from "lorga-ui";
import { toRefs } from "vue";

import useCmd from "@/composables/useCmd";

const props = defineProps<{
  query: () => void;
  eventUuid: string;
  occurrenceName: string;
  originalStart: string;
}>();
const { query, occurrenceName } = toRefs(props);

const { commandRequest, commandModalOpen } = useCmd(query.value);

defineExpose({
  open: () => {
    commandModalOpen.value = true;
  },
});
</script>

<template>
  <ModalDelete
    v-model="commandModalOpen"
    title="Cancel This Event"
    :obj-name="occurrenceName"
    :request="commandRequest"
    :data="{
      action: 'calendar/cancel_event_occurrence',
      event_uuid: eventUuid,
      original_start: originalStart,
    }"
  />
</template>
