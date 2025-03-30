<template>
  <ButtonNormal kind="delete" @click="removeMemberModalOpen = true">
    Remove
    <ModalConfirm
      v-model="removeMemberModalOpen"
      :request="removeMemberRequest"
      :data="{
        group_uuid: groupUuid,
        member_uuid: memberUuid,
        action: 'mail/remove_member_from_group',
      }"
      title="Remove member"
      submit="Remove"
    >
      Are you sure you want to remove {{ memberName }} from this group?
    </ModalConfirm>
  </ButtonNormal>
</template>

<script setup lang="ts">
import useCmd from "@/composables/useCmd";
import { ModalConfirm, ButtonNormal } from "lorga-ui";
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
} = useCmd(query.value);
</script>
