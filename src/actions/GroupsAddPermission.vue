<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Add Permission
    <ModalCreate
      v-model="commandModalOpen"
      title="Add Permission"
      :fields="permissionFields"
      :data="{ group_has_permission: groupId }"
      :request="commandRequest"
    />
  </ButtonNormal>
</template>

<script lang="ts" setup>
import { ModalCreate, ButtonNormal, types } from "@lawandorga/components";
import { ref, toRefs, watch } from "vue";
import AdminService from "@/services/admin";
import { Permission } from "@/types/core";
import useCommand from "@/composables/useCommand";
import useClient from "@/api/client";

const props = defineProps<{ query: () => void; groupId: number }>();
const { query, groupId } = toRefs(props);

const permissionFields = ref<types.FormField[]>([
  {
    label: "Permission",
    name: "permission",
    type: "select",
    required: true,
    options: [] as Permission[],
  },
]);

const client = useClient();
const request = client.post<{
  group_has_permission: number;
  permission: number;
}>("api/has_permissions/");

const { commandRequest, commandModalOpen } = useCommand(request, query.value);

watch(commandModalOpen, () =>
  AdminService.getPermissions().then(
    (users) => (permissionFields.value[0].options = users),
  ),
);
</script>
