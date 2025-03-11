<template>
  <ButtonNormal kind="secondary" @click="commandModalOpen = true">
    Update Org
    <ModalForm
      v-model="commandModalOpen"
      title="Update Org"
      :request="commandRequest"
      :fields="fields"
      :data="{
        action: 'org/update_org',
        org_id: orgId,
        org_name: orgName,
        default_group_for_new_users_id: defaultGroupForNewUsers,
      }"
    />
  </ButtonNormal>
</template>

<script setup lang="ts">
import useCmd from "@/composables/useCmd";
import { useGroups } from "@/features/org/api/useGroups";
import { ButtonNormal, ModalForm, types } from "lorga-ui";
import { computed, toRefs } from "vue";

const props = defineProps<{
  query: () => void;
  orgId: number;
  orgName: string;
  defaultGroupForNewUsers: number | null;
}>();
const { query } = toRefs(props);

const { groups } = useGroups();

const fields = computed<types.FormField[]>(() => [
  {
    label: "Name",
    type: "text",
    name: "org_name",
    required: true,
  },
  {
    label: "Default group for new users",
    type: "select",
    name: "default_group_for_new_users_id",
    required: true,
    options: groups.value || [],
  },
]);

const { commandModalOpen, commandRequest } = useCmd(query.value);
</script>
