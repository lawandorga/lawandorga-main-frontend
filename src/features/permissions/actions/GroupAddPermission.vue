<template>
  <ButtonNormal kind="secondary" @click="commandModalOpen = true">
    Add Permission
    <ModalCreate
      v-model="commandModalOpen"
      title="Add Permission"
      :fields="permissionFields"
      :data="{
        group_id: groupId,
        action: 'permissions/create_has_permission',
        user_id: null,
      }"
      :request="commandRequest"
    />
  </ButtonNormal>
</template>

<script lang="ts" setup>
import { ModalCreate, ButtonNormal, types } from "lorga-ui";
import { computed, toRefs } from "vue";
import { usePermissions } from "@/composables/usePermissions";
import useCmd from "@/composables/useCmd";

const props = defineProps<{ query: () => void; groupId: number }>();
const { query, groupId } = toRefs(props);

const { permissions } = usePermissions();

const permissionFields = computed<types.FormField[]>(() => [
  {
    label: "Permission",
    name: "permission_id",
    type: "select",
    required: true,
    options: permissions.value || [],
  },
]);

const { commandRequest, commandModalOpen } = useCmd(query.value);
</script>
