<template>
  <ButtonNormal kind="delete" @click="commandModalOpen = true">
    Delete
  </ButtonNormal>
  <ModalDelete
    v-model="commandModalOpen"
    title="Delete Footer Template"
    :request="commandRequest"
    :data="{ action: 'collab/delete_footer', footer_uuid: uuid }"
    :obj-name="title"
  />
</template>

<script setup lang="ts">
import useCmd from "@/composables/useCmd";
import { ButtonNormal, ModalDelete } from "lorga-ui";
import { toRefs } from "vue";

const props = defineProps<{
  title: string;
  uuid: string;
  query: () => void;
}>();
const { query } = toRefs(props);

const { commandRequest, commandModalOpen } = useCmd(query.value);
</script>
