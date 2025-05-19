<script lang="ts" setup>
import { ButtonNormal, ModalUpdate, types } from "lorga-ui";
import { toRefs } from "vue";
import useCmd from "@/composables/useCmd";

const props = defineProps<{
  query: () => void;
  eventUuid: string;
  eventTime: string;
  eventText: string;
  eventTitle: string;
}>();
const { query } = toRefs(props);

const fields: types.FormField[] = [
  {
    label: "Title",
    name: "title",
    type: "text",
    required: true,
  },
  {
    label: "Time",
    name: "time",
    type: "datetime-local",
    required: true,
  },
  {
    label: "Text",
    name: "text",
    type: "textarea",
    required: true,
  },
];

const { commandRequest, commandModalOpen } = useCmd(query.value);
</script>

<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Update
  </ButtonNormal>
  <ModalUpdate
    v-model="commandModalOpen"
    :fields="fields"
    title="Update Timeline Event"
    :request="commandRequest"
    :data="{
      uuid: eventUuid,
      time: eventTime.slice(0, 16),
      text: eventText,
      title: eventTitle,
      action: 'timeline/update_event',
    }"
    submit="Update"
  />
</template>
