<template>
  <ModalCreate
    v-model="addEventModalOpen"
    title="Add Event"
    :fields="eventFields"
    :request="addEventRequest"
  />
  <ModalUpdate
    v-model="updateEventModalOpen"
    title="Update Event"
    :fields="eventFields"
    :request="updateRequest"
    :initial="eventUpdateTemporary"
  />
  <ModalDelete
    v-model="deleteEventModalOpen"
    title="Delete Event"
    verb="delete"
    :request="deleteRequest"
    :object="eventTemporary"
  />
</template>

<script setup lang="ts">
import { Ref, ref } from "vue";
import useGet from "@/composables/useGet";
import EventService from "@/services/event";
import { Event } from "@/types/event";
import { ModalCreate, ModalDelete, ModalUpdate } from "@lawandorga/components";
import useCommand from "@/composables/useCommand";
import useQuery from "@/composables/useQuery";
import useDelete from "@/composables/useDelete";
import useUpdate from "@/composables/useUpdate";

const events = ref(null) as Ref<Event[] | null>;
useGet(EventService.getEvents, events);

const eventFields = ref([
  {
    label: "Name",
    name: "name",
    type: "text",
    required: true,
  },
  {
    label: "Description",
    name: "description",
    type: "textarea",
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
]);

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
