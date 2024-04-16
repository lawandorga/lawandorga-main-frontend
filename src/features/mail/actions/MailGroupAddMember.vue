<template>
  <ButtonNormal kind="action" @click="addMemberModalOpen = true">
    Add Member
    <ModalForm
      v-model="addMemberModalOpen"
      :fields="addMemberFields"
      :request="addMemberRequest"
      :data="{ group_uuid: groupUuid, action: 'mail/add_member_to_group' }"
      title="Add member"
      submit="Add"
    />
  </ButtonNormal>
</template>

<script setup lang="ts">
import useCmd from "@/composables/useCmd";
import { MailUser } from "@/types/mail";
import { ModalForm, types, ButtonNormal } from "lorga-ui";
import { computed, toRefs } from "vue";

const props = defineProps<{
  query: () => void;
  groupUuid: string;
  availableUsers: MailUser[];
}>();
const { query, availableUsers } = toRefs(props);

const {
  commandRequest: addMemberRequest,
  commandModalOpen: addMemberModalOpen,
} = useCmd(query.value);

const addMemberFields = computed<types.FormField[]>(() => [
  {
    label: "Member",
    name: "member_uuid",
    type: "select",
    required: true,
    options: availableUsers.value,
  },
]);
</script>
