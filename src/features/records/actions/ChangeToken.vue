<script setup lang="ts">
import useCmd from "@/composables/useCmd";
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

const { commandRequest, commandModalOpen } = useCmd(query);
</script>

<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    {{ text }}
    <ModalUpdate
      v-model="commandModalOpen"
      title="Change Token"
      :fields="fields"
      :request="commandRequest"
      :data="{
        uuid: recordUuid,
        token: recordToken,
        action: 'records/change_token',
      }"
    />
  </ButtonNormal>
</template>
