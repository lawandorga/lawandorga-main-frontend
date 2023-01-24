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
import {
  FormGenerator,
  ModalFree,
  types,
  ButtonNormal,
} from "@lawandorga/components";
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
    label: "Description",
    name: "description",
    type: "custom",
    required: true,
  },
  {
    label: "Global Event?",
    name: "is_global",
    type: "toggle",
    required: false,
    helptext:
      "Global events are visible to all users in your meta-organization.",
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
