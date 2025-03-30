<template>
  <ButtonNormal kind="delete" @click="commandModalOpen = true">
    Delete
    <ModalDelete
      v-model="commandModalOpen"
      :data="{ group_id: groupId, action: 'org/delete_group' }"
      :request="commandRequest"
    />
  </ButtonNormal>
</template>

<script lang="ts" setup>
import { toRefs } from "vue";
import { ButtonNormal, ModalDelete } from "lorga-ui";
import useCmd from "@/composables/useCmd";

const props = defineProps<{
  query: () => void;
  groupId: number;
  groupName: string;
}>();
const { query, groupId } = toRefs(props);

const { commandRequest, commandModalOpen } = useCmd(query.value);
</script>
