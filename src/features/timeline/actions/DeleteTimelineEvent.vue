<script lang="ts" setup>
import { ButtonNormal, ModalDelete } from "lorga-ui";
import { toRefs } from "vue";
import useCmd from "@/composables/useCmd";

const props = defineProps<{
  query: () => void;
  timelineEventUuid: string;
  name: string;
}>();
const { query } = toRefs(props);

const { commandRequest, commandModalOpen } = useCmd(query.value);
</script>

<template>
  <ButtonNormal kind="delete" @click="commandModalOpen = true">
    Delete
  </ButtonNormal>
  <ModalDelete
    v-model="commandModalOpen"
    title="Delete Timeline Event"
    :request="commandRequest"
    :data="{
      uuid: timelineEventUuid,
      action: 'timeline/delete_event',
    }"
    submit="Delete"
  />
</template>
