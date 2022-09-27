<template><div></div></template>

<script setup lang="ts">
import useGet from "@/composables/useGet";
import { Message } from "@/types/records";
import RecordsService from "@/services/records";
import { ref } from "vue";
import useCreateItem from "@/composables/useCreateItem";
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
useGet(RecordsService.getMessages, messages, route.params.id as string);

// create
const { createRequest } = useCreateItem(RecordsService.createMessage, messages);

// expose
defineExpose({
  messages,
  createRequest,
  fields,
});
</script>
