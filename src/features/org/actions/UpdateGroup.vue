<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Change
    <ModalUpdate
      v-model="commandModalOpen"
      :fields="fields"
      :request="commandRequest"
      :data="{
        group_id: groupId,
        name: groupName,
        description: groupDescription,
        action: 'org/update_group',
      }"
    />
  </ButtonNormal>
</template>

<script lang="ts" setup>
import { toRefs } from "vue";
import { ButtonNormal, ModalUpdate, types } from "lorga-ui";
import useCmd from "@/composables/useCmd";

const props = defineProps<{
  query: () => void;
  groupId: number;
  groupName: string;
  groupDescription: string;
}>();
const { query, groupId } = toRefs(props);

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
