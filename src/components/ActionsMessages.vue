<template><div></div></template>

<script setup lang="ts">
import useGet from "@/composables/useGet";
import { Message } from "@/types/records";
import RecordsService from "@/services/records";
import { ref } from "vue";
import useCreate from "@/composables/useCreate";
import { useRoute } from "vue-router";

// route
const route = useRoute();

// messages
const messages = ref<Message[] | null>(null);

// fields
const fields = [
  {
    label: "Message",
    type: "textarea",
    name: "message",
    required: true,
  },
];

// get
useGet(RecordsService.getMessages, messages, route.params.record as string);

// create
const { createRequest } = useCreate(RecordsService.createMessage, messages);

// expose
defineExpose({
  messages,
  createRequest,
  fields,
});
</script>
