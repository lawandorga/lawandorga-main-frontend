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
import useCommand from "@/composables/useCommand";
import useClient from "@/api/client";

// props
const props = defineProps<{
  query: () => void;
  folderUuid?: string;
}>();
const { query, folderUuid } = toRefs(props);

// request
const client = useClient();
const request = client.post("api/messages/messages/");

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
const { commandRequest } = useCommand(request, query.value);
</script>
