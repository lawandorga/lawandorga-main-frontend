<script lang="ts" setup>
import { ButtonNormal, ModalUpdate, types } from "lorga-ui";
import { toRefs } from "vue";
import useCmd from "@/composables/useCmd";

const props = defineProps<{
  query: () => void;
  followUpUuid: string;
  followUpTime: string;
  followUpText: string;
  followUpTitle: string;
  followUpIsDone: boolean | null;
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
  {
    label: "Is Done",
    name: "is_done",
    type: "toggle",
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
    title="Update Folow Up"
    :request="commandRequest"
    :data="{
      action: 'timeline/update_follow_up',
      uuid: followUpUuid,
      time: followUpTime.slice(0, 16),
      text: followUpText,
      title: followUpTitle,
      is_done: followUpIsDone,
    }"
    submit="Update"
  />
</template>
