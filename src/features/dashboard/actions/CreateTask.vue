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
const props = defineProps<{ query: () => void; secondQuery: () => void }>();
const { query, secondQuery } = toRefs(props);

const { formProfiles } = useProfiles();

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

const { commandModalOpen, commandRequest } = useCmd(query, secondQuery);
</script>
