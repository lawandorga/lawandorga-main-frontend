<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    {{ text }}
    <ModalUpdate
      v-model="commandModalOpen"
      title="Change Token"
      :fields="fields"
      :request="commandRequest"
      :data="{ uuid: recordUuid, token: recordToken }"
    />
  </ButtonNormal>
</template>

<script setup lang="ts">
import useClient from "@/api/client";
import useCommand from "@/composables/useCommand";
import { ButtonNormal, ModalUpdate, types } from "lorga-ui";
import { toRefs } from "vue";

const props = withDefaults(
  defineProps<{
    recordUuid: string;
    recordToken: string;
    query: () => void;
    text?: string;
  }>(),
  { text: "Change Token" },
);
const { query, recordUuid } = toRefs(props);

const fields: types.FormField[] = [
  { label: "Token", name: "token", type: "text", required: true },
];

const client = useClient();

const request = client.put(
  "api/records/v2/records/{}/change_token/",
  recordUuid,
);

const { commandRequest, commandModalOpen } = useCommand(request, query.value);
</script>
