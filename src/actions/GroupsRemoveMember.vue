<template>
  <ButtonNormal kind="delete" @click="commandModalOpen = true">
    Remove
    <ModalDelete
      v-model="commandModalOpen"
      verb="remove"
      title="Remove Member"
      :request="commandRequest"
      :data="{ member: memberId, name: memberName }"
    />
  </ButtonNormal>
</template>

<script lang="ts" setup>
import useCommand from "@/composables/useCommand";
import { ButtonNormal, ModalDelete } from "@lawandorga/components";
import { toRefs } from "vue";
import useClient from "@/api/client";

const props = defineProps<{
  query: () => void;
  groupId: number;
  memberName: string;
  memberId: number;
}>();

const { query, groupId, memberName, memberId } = toRefs(props);

const client = useClient();

const request = client.post<{ member: number }>(
  "api/groups/{}/remove_member/",
  groupId,
);

const { commandRequest, commandModalOpen } = useCommand(request, query.value);
</script>
