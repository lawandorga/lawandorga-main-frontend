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
      }"
    />
  </ButtonNormal>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import useCmd from "@/composables/useCmd";
import { useProfiles } from "@/features/admin/api/useProfiles";
import { ButtonNormal, ModalCreate } from "lorga-ui";
import { FormField, FormOptionInput } from "lorga-ui/dist/types/types/form";
import { toRefs } from "vue";

const props = defineProps<{ query: () => void }>();
const { query } = toRefs(props);
// TODO: create query function

const { profiles } = useProfiles();
const profileData = ref<FormOptionInput[]>([]);

watch(profiles, (newProfiles) => {
  if (newProfiles) {
    profileData.value =
      newProfiles?.map(
        (profile): FormOptionInput => ({
          id: profile.id,
          name: profile.name,
          value: profile.id,
        }),
      ) ?? [];
  }
});

// TODO: get the current URL
const taskFields = computed<FormField[]>(() => [
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
    type: "date",
  },
  {
    label: "Assignee",
    name: "assignee_id",
    required: true,
    type: "select",
    options: profileData.value,
  },
  {
    label: "Page URL",
    name: "page_url",
    required: false,
    disabled: false,
    type: "text",
  },
]);

const { commandModalOpen, commandRequest } = useCmd(query);
</script>
