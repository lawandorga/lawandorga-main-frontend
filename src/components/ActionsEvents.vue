<template>
  <ModalFree v-model="addEventModalOpen" width="max-w-2xl" title="Add Event">
    <FormGenerator :fields="eventFields" :request="addEventRequest">
      <template #custom="{ data }">
        <FormWysiwyg
          v-model="data['description']"
          required
          label="Description"
        />
      </template>
    </FormGenerator>
  </ModalFree>
  <ModalFree
    v-model="updateEventModalOpen"
    width="max-w-2xl"
    title="Update Event"
  >
    <FormGenerator
      :initial="{
        id: eventUpdateTemporary?.id,
        description: eventUpdateTemporary?.description,
        name: eventUpdateTemporary?.name,
        is_global: eventUpdateTemporary?.is_global,
        start_time: eventUpdateTemporary?.start_time,
        end_time: eventUpdateTemporary?.end_time,
      }"
      :fields="eventFields"
      :request="updateRequest"
    >
      <template #custom="{ data }">
        <FormWysiwyg
          v-model="data['description']"
          required
          label="Description"
        />
      </template>
    </FormGenerator>
  </ModalFree>
  <ModalDelete
    v-model="deleteEventModalOpen"
    title="Delete Event"
    verb="delete"
    :request="deleteRequest"
    :data="eventTemporary"
  />
</template>

<script setup lang="ts">
import { Ref, ref } from "vue";
import useGet from "@/composables/useGet";
import EventService from "@/services/event";
import { Event } from "@/types/event";
import {
  FormGenerator,
  ModalDelete,
  ModalFree,
  types,
} from "@lawandorga/components";
import useCommand from "@/composables/useCommand";
import useQuery from "@/composables/useQuery";
import useDelete from "@/composables/useDelete";
import useUpdate from "@/composables/useUpdate";
import FormWysiwyg from "./FormWysiwyg.vue";

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
  useCommand(
    EventService.createEvent,
    useQuery(EventService.getEvents, events),
  );

const {
  temporary: eventUpdateTemporary,
  updateRequest,
  updateModalOpen: updateEventModalOpen,
} = useUpdate(EventService.updateEvent, events);

const {
  temporary: eventTemporary,
  deleteRequest,
  deleteModalOpen: deleteEventModalOpen,
} = useDelete(EventService.deleteEvent, events);

defineExpose({
  events,
  eventUpdateTemporary,
  eventTemporary,
  addEventModalOpen,
  updateEventModalOpen,
  deleteEventModalOpen,
});
</script>
