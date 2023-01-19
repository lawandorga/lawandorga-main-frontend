<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Add Member
    <ModalCreate
      v-model="commandModalOpen"
      title="Add Member"
      :fields="fields"
      :request="commandRequest"
    />
  </ButtonNormal>
</template>

<script lang="ts" setup>
import useCommand from "@/composables/useCommand";
import { ModalCreate, ButtonNormal, types } from "@lawandorga/components";
import { ref, toRefs, watch } from "vue";
import AdminService from "@/services/admin";
import { RlcUserSmall } from "@/types/user";
import useClient from "@/api/client";

const props = defineProps<{ groupId: number; query: () => void }>();
const { groupId, query } = toRefs(props);

const fields = ref<types.FormField[]>([
  {
    label: "User",
    name: "new_member",
    type: "combobox",
    required: true,
    options: [] as RlcUserSmall[],
  },
]);

const client = useClient();
const request = client.post<{ new_member: number }>(
  "api/groups/{}/add_member/",
  groupId,
);

const { commandRequest, commandModalOpen } = useCommand(request, query.value);

watch(commandModalOpen, (newValue) => {
  if (newValue)
    AdminService.getUsers().then((users) => (fields.value[0].options = users));
});
</script>
