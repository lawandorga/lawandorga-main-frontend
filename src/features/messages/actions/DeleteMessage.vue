<template>
  <ButtonNormal kind="delete" @click="commandModalOpen = true">
    Delete
    <ModalDelete
      v-model="commandModalOpen"
      title="Delete Message"
      :request="commandRequest"
      :obj-name="deleteName"
      :data="{
        message_id: messageId,
        action: 'messages/delete_message',
      }"
    ></ModalDelete>
  </ButtonNormal>
</template>

<script setup lang="ts">
import { ButtonNormal, ModalDelete } from "lorga-ui";
import { toRefs } from "vue";
import useCmd from "@/composables/useCmd";

const props = defineProps<{
  messageId: number;
  deleteName: string;
  query: () => void;
}>();
const { query } = toRefs(props);

const { commandRequest, commandModalOpen } = useCmd(query);
</script>
