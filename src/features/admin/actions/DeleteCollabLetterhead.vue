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

<template>
  <ButtonNormal kind="delete" class="ml-5" @click="commandModalOpen = true">
    Delete
  </ButtonNormal>
  <ModalDelete
    v-model="commandModalOpen"
    title="Delete Letterhead Template"
    :request="commandRequest"
    :data="{ action: 'collab/delete_letterhead', letterhead_uuid: uuid }"
    :obj-name="title"
  />
</template>
