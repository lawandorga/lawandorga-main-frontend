<template>
  <ButtonNormal kind="secondary" @click="commandModalOpen = true">
    Create Task
    <ModalCreate
      v-model="commandModalOpen"
      title="Create Task"
      :fields="taskFields"
      submit="Create"
      :request="commandRequest"
      :data="{
        action: 'tasks/create_task',
        page_url: pageURL,
      }"
    />
  </ButtonNormal>
</template>

<script setup lang="ts">
import { computed } from "vue";
import useCmd from "@/composables/useCmd";
import { useProfiles } from "@/features/admin/api/useProfiles";
import { ButtonNormal, ModalCreate, types } from "lorga-ui";
import { toRefs } from "vue";

const pageURL = window.location.pathname;
const props = defineProps<{ query: () => void }>();
const { query } = toRefs(props);
// TODO: create query function  -- this is not a todo this comes from the outside on the dashboard you want to requery the tasks after a new one was created

const { formProfiles } = useProfiles();

// TODO: pls rename this to CreateTask often i made mistake of naming with
// nouns in the beginning but for the actions it is best to just use the actual action
// kinda like avoiding hungarian notation

// TODO: get the current URL
const taskFields = computed<types.FormField[]>(() => [
  { label: "Title", name: "title", required: true, type: "text" },
  {
    label: "Description",
    name: "description",
    required: false,
    type: "textarea",
  },
  {
    label: "Deadline",
    name: "deadline",
    required: false,
    type: "datetime-local",
  },
  {
    label: "Assignee",
    name: "assignee_id",
    required: true,
    type: "select",
    options: formProfiles.value,
  },
]);

const { commandModalOpen, commandRequest } = useCmd(query);
</script>
