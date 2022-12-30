<template>
  <FormGenerator
    :fields="fields"
    :data="{ folder: folderUuid }"
    :request="commandRequest"
    @success="data['message'] = ''"
    @change="data = $event"
  ></FormGenerator>
</template>

<script setup lang="ts">
import { FormGenerator, types } from "@lawandorga/components";
import { ref, toRefs } from "vue";
import { messagesSendMessage } from "@/services/messages";
import useCommand from "@/composables/useCommand";

// props
const props = defineProps<{
  query: () => void;
  folderUuid?: string;
}>();
const { query, folderUuid } = toRefs(props);

// send message
const data = ref();
const fields: types.FormField[] = [
  {
    label: "Message",
    type: "textarea",
    name: "message",
    required: true,
  },
];
const { commandRequest } = useCommand(messagesSendMessage, query.value);
</script>
