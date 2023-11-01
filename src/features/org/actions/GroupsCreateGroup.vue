<template>
  <ButtonNormal size="xs" kind="action" @click="commandModalOpen = true">
    Create Group
    <ModalCreate
      v-model="commandModalOpen"
      :fields="fields"
      :request="commandRequest"
      :data="{
        action: 'org/create_group',
      }"
    />
  </ButtonNormal>
</template>

<script lang="ts" setup>
import { toRefs } from "vue";
import useCmd from "@/composables/useCmd";
import { ButtonNormal, ModalCreate, types } from "lorga-ui";

const props = defineProps<{ query: () => void }>();
const { query } = toRefs(props);

const fields: types.FormField[] = [
  {
    label: "Name",
    type: "text",
    name: "name",
    required: true,
  },
  {
    label: "Description",
    type: "textarea",
    name: "description",
    required: false,
  },
];

const { commandRequest, commandModalOpen } = useCmd(query.value);
</script>
