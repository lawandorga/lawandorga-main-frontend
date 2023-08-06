<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Change
    <ModalUpdate
      v-model="commandModalOpen"
      :fields="fields"
      :request="commandRequest"
      :data="{ id: groupId, name: groupName, description: groupDescription }"
    />
  </ButtonNormal>
</template>

<script lang="ts" setup>
import { toRefs } from "vue";
import useCommand from "@/composables/useCommand";
import { ButtonNormal, ModalUpdate, types } from "lorga-ui";
import useClient from "@/api/client";

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

const client = useClient();
const request = client.put("api/groups/{}/", groupId);

const { commandRequest, commandModalOpen } = useCommand(request, query.value);
</script>
