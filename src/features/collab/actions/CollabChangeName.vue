<script setup lang="ts">
import useCmd from "@/composables/useCmd";
import { ButtonNormal, ModalUpdate } from "lorga-ui";
import { toRefs } from "vue";

const props = defineProps<{ name: string; uuid: string; query: () => void }>();
const { query } = toRefs(props);

const fields = [
  {
    label: "Name",
    type: "text",
    name: "title",
    required: true,
  },
];

const { commandModalOpen, commandRequest } = useCmd(query.value);

defineExpose({
  commandModalOpen,
});
</script>

<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Change Name
    <ModalUpdate
      v-model="commandModalOpen"
      title="Change Name"
      submit="Save"
      :fields="fields"
      :request="commandRequest"
      :data="{
        action: 'collab/update_collab',
        collab_uuid: uuid,
        title: name,
      }"
    />
  </ButtonNormal>
</template>
