<template>
  <ButtonNormal kind="action" @click="addEventModalOpen = true">
    Add Event
    <ModalFree v-model="addEventModalOpen" width="max-w-2xl" title="Add Event">
      <FormGenerator :fields="eventFields" :request="addEventRequest">
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
import { Ref, ref, toRefs } from "vue";
import useGet from "@/composables/useGet";
import EventService from "@/services/event";
import { Event } from "@/types/event";
import { FormGenerator, ModalFree, types, ButtonNormal } from "lorga-ui";
import useCommand from "@/composables/useCommand";
import FormWysiwyg from "@/components/FormWysiwyg.vue";

const props = defineProps<{ query: () => void }>();
const { query } = toRefs(props);

const events = ref(null) as Ref<Event[] | null>;
useGet(EventService.getEvents, events);

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

const { commandRequest: addEventRequest, commandModalOpen: addEventModalOpen } =
  useCommand(EventService.createEvent, query.value);
</script>
