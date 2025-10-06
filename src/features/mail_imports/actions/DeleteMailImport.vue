<script setup lang="ts">
import useCmd from "@/composables/useCmd";
import { ButtonNormal, ModalDelete } from "lorga-ui";
import { toRefs } from "vue";

const props = defineProps<{
  query: () => void;
  mailUuid: string;
}>();
const { mailUuid } = toRefs(props);

const { commandModalOpen, commandRequest } = useCmd(props.query);
</script>

<template>
  <ButtonNormal kind="delete" @click="commandModalOpen = true">
    Delete Import
  </ButtonNormal>
  <ModalDelete
    v-model="commandModalOpen"
    title="Delete Mail Import"
    :request="commandRequest"
    :data="{
      mail_uuid: mailUuid,
      action: 'mail_imports/delete_mail',
    }"
  />
</template>
