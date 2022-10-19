<template>
  <div></div>
  <ModalCreate
    v-model="addEventModalOpen"
    title="Add Event"
    :fields="eventFields"
    :request="addEventRequest"
  />
</template>

<script setup lang="ts">
import { Ref, ref } from "vue";
import useGet from "@/composables/useGet";
import EventService from "@/services/event";
import { Event } from "@/types/event";
import { ModalCreate } from "@lawandorga/components";
import useCommand from "@/composables/useCommand";
import useQuery from "@/composables/useQuery";

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
    type: "checkbox",
    required: false,
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
  useCommand(EventService.createEvent, useQuery(EventService.getEvents, events));

defineExpose({
  events,
  addEventModalOpen,
});
</script>
