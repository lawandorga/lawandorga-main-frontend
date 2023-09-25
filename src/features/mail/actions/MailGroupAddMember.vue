<template>
  <ButtonNormal kind="action" @click="addMemberModalOpen = true">
    Add Member
    <ModalForm
      v-model="addMemberModalOpen"
      :fields="addMemberFields"
      :request="addMemberRequest"
      :data="{ group: groupUuid }"
      title="Add member"
      submit="Add"
    />
  </ButtonNormal>
</template>

<script setup lang="ts">
import useCommand from "@/composables/useCommand";
import { mailGroupAddMember } from "@/services/mail";
import { IMailUser } from "@/types/mail";
import { ModalForm, types, ButtonNormal } from "lorga-ui";
import { computed, toRefs } from "vue";

const props = defineProps<{
  query: () => void;
  groupUuid: string;
  availableUsers: IMailUser[];
}>();
const { query, availableUsers } = toRefs(props);

const {
  commandRequest: addMemberRequest,
  commandModalOpen: addMemberModalOpen,
} = useCommand(mailGroupAddMember, query.value);
const addMemberFields = computed<types.FormField[]>(() => [
  {
    label: "Member",
    name: "member",
    type: "select",
    required: true,
    options: availableUsers.value,
  },
]);
</script>
