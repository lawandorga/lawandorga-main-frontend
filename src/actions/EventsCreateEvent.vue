<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Add Event
    <ModalFree v-model="commandModalOpen" width="max-w-2xl" title="Add Event">
      <FormGenerator
        :fields="eventFields"
        :request="commandRequest"
        :data="{ action: 'events/create_event' }"
      >
        <template #custom="{ data }">
          <FormWysiwyg
            v-model="data.description"
            required
            label="Description"
          />
        </template>
      </FormGenerator>
    </ModalFree>
  </ButtonNormal>
</template>

<script setup lang="ts">
import { ref, toRefs } from "vue";
import { FormGenerator, ModalFree, types, ButtonNormal } from "lorga-ui";
import FormWysiwyg from "@/components/FormWysiwyg.vue";
import useCmd from "@/composables/useCmd";

const props = defineProps<{ query: () => void }>();
const { query } = toRefs(props);

const eventFields = ref<types.FormField[]>([
  {
    label: "Name",
    name: "name",
    type: "text",
    required: true,
  },
  {
    name: "custom",
    type: "slot",
  },
  {
    label: "Who Should See This Event?",
    name: "level",
    type: "select",
    required: true,
    options: [
      { name: "Organization", value: "ORG" },
      { name: "Meta", value: "META" },
      // { name: "Global", value: "GLOBAL" },
    ],
    helptext:
      "Organization events are only visible to all users of your organisation. Meta events are visible to all organisations of your meta org, like for example all Law Clinics. Global events are visible to all users of Law&Orga.",
  },
  {
    label: "Start time",
    name: "start_time",
    type: "datetime-local",
    required: true,
  },
  {
    label: "End time",
    name: "end_time",
    type: "datetime-local",
    required: true,
  },
] as types.FormField[]);

const { commandRequest, commandModalOpen } = useCmd(query);
</script>
