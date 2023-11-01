<template>
  <ButtonNormal kind="delete" @click="commandModalOpen = true">
    Remove
    <ModalConfirm
      v-model="commandModalOpen"
      title="Remove Member"
      :request="commandRequest"
      :data="{
        member_id: memberId,
        group_id: groupId,
        action: 'org/remove_member_from_group',
      }"
      :object-name="memberName"
    >
      Are you sure you want to remove '{{ memberName }}' from this group?
    </ModalConfirm>
  </ButtonNormal>
</template>

<script lang="ts" setup>
import { ButtonNormal, ModalConfirm } from "lorga-ui";
import { toRefs } from "vue";
import useCmd from "@/composables/useCmd";

const props = defineProps<{
  query: () => void;
  groupId: number;
  memberName: string;
  memberId: number;
}>();

const { query, groupId, memberName, memberId } = toRefs(props);

const { commandRequest, commandModalOpen } = useCmd(query.value);
</script>
