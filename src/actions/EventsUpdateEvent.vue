<template>
  <ButtonNormal
    v-if="userStore.rlc?.id === event.org.id"
    size="xs"
    kind="action"
    @click="commandModalOpen = true"
  >
    Edit
    <ModalFree
      v-model="commandModalOpen"
      width="max-w-2xl"
      title="Update Event"
    >
      <FormGenerator
        :data="{
          id: event.id,
          description: event.description,
          name: event.name,
          level: event.level,
          start_time: event.start_time.slice(0, 16),
          end_time: event.end_time.slice(0, 16),
        }"
        :fields="eventFields"
        :request="commandRequest"
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
import EventService from "@/services/event";
import { FormGenerator, ButtonNormal, ModalFree, types } from "lorga-ui";
import useCommand from "@/composables/useCommand";
import FormWysiwyg from "@/components/FormWysiwyg.vue";
import { useUserStore } from "@/store/user";
import { Event } from "@/types/event";

const props = defineProps<{ query: () => void; event: Event }>();
const { query } = toRefs(props);

const userStore = useUserStore();

const eventFields = ref<types.FormField[]>([
  {
    label: "Name",
    name: "name",
    type: "text",
    required: true,
  },
  {
    label: "Description",
    name: "description",
    type: "custom",
    required: true,
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

const { commandRequest, commandModalOpen } = useCommand(
  EventService.updateEvent,
  query.value,
);
</script>
