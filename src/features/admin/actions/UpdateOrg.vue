<script setup lang="ts">
import useCmd from "@/composables/useCmd";
import { useGroups } from "@/features/org/api/useGroups";
import { useUserStore } from "@/store/user";
import { ButtonNormal, ModalForm, types } from "lorga-ui";
import { computed, toRefs } from "vue";

const props = defineProps<{
  query: () => void;
  orgId: number;
  orgName: string;
  defaultGroupForNewUsers: number | null;
  orgIsEventsEnabled: boolean;
  orgIsMailEnabled: boolean;
  orgIsChatEnabled: boolean;
  orgUserQualifications: string[];
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
  {
    label: "Events Enabled",
    type: "singlecheckbox",
    name: "is_events_enabled",
    helptext: "If enabled it will show up in the navigation",
  },
  {
    label: "Mail Enabled",
    type: "singlecheckbox",
    name: "is_mail_enabled",
    helptext: "If enabled it will show up in the navigation",
  },
  {
    label: "Chat Enabled",
    type: "singlecheckbox",
    name: "is_chat_enabled",
    helptext: "If enabled it will show up in the navigation",
  },
  {
    label: "User Qualifications",
    type: "list",
    name: "user_qualifications",
    helptext: "List of qualifications that can be assigned to a user",
  },
]);

const userStore = useUserStore();

const { commandModalOpen, commandRequest } = useCmd(
  query,
  userStore.updateData,
);
</script>

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
        is_events_enabled: orgIsEventsEnabled,
        is_mail_enabled: orgIsMailEnabled,
        is_chat_enabled: orgIsChatEnabled,
        user_qualifications: orgUserQualifications,
      }"
    />
  </ButtonNormal>
</template>
