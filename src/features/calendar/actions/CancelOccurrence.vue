<script setup lang="ts">
import { ModalDelete } from "lorga-ui";
import { computed, toRefs } from "vue";

import useCmd from "@/composables/useCmd";
import { formatDate } from "@/utils/date";

import type { ResolvedOccurrence } from "../utils/occurrences";

const props = defineProps<{
  query: () => void;
  eventUuid: string;
  occurrence: ResolvedOccurrence;
}>();
const { query } = toRefs(props);

const { commandRequest, commandModalOpen } = useCmd(query);

const occurrenceName = computed(
  () =>
    `${props.occurrence.title} (${formatDate(props.occurrence.start, true)})`,
);

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
      original_start: occurrence.originalStart,
    }"
  />
</template>
