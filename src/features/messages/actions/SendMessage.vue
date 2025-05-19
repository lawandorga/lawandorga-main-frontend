<script setup lang="ts">
import { FormGenerator, types } from "lorga-ui";
import { ref, toRefs } from "vue";
import useCmd from "@/composables/useCmd";

const props = defineProps<{
  query: () => void;
  folderUuid?: string;
}>();

const { query, folderUuid } = toRefs(props);

const data = ref();

const fields: types.FormField[] = [
  {
    label: "Message",
    type: "textarea",
    name: "message",
    required: true,
  },
];
const { commandRequest } = useCmd(query);
</script>

<template>
  <FormGenerator
    :fields="fields"
    :data="{ folder_uuid: folderUuid, action: 'messages/create_message' }"
    :request="commandRequest"
    @success="data['message'] = ''"
    @change="data = $event"
  ></FormGenerator>
</template>
