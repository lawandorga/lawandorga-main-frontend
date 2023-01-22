<template>
  <ButtonNormal kind="delete" @click="removeMemberModalOpen = true">
    Remove
    <ModalConfirm
      v-model="removeMemberModalOpen"
      :request="removeMemberRequest"
      :data="{ group: groupUuid, member: memberUuid }"
      title="Remove member"
      submit="Remove"
    >
      Are you sure you want to remove {{ memberName }} from this group?
    </ModalConfirm>
  </ButtonNormal>
</template>

<script setup lang="ts">
import useCommand from "@/composables/useCommand";
import { mailGroupRemoveMember } from "@/services/mail";
import { ModalConfirm, ButtonNormal } from "@lawandorga/components";
import { toRefs } from "vue";

const props = defineProps<{
  query: () => void;
  groupUuid: string;
  memberName: string;
  memberUuid: string;
}>();
const { query } = toRefs(props);

const {
  commandRequest: removeMemberRequest,
  commandModalOpen: removeMemberModalOpen,
} = useCommand(mailGroupRemoveMember, query.value);
</script>
