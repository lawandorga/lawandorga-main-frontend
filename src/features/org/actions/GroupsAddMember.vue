<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Add Member
    <ModalCreate
      v-model="commandModalOpen"
      title="Add Member"
      :fields="fields"
      :request="commandRequest"
      :data="{
        action: 'org/add_member_to_group',
        group_id: groupId,
      }"
    />
  </ButtonNormal>
</template>

<script lang="ts" setup>
import { ModalCreate, ButtonNormal, types } from "lorga-ui";
import { computed, ref, toRefs, watch } from "vue";
import useCmd from "@/composables/useCmd";
import useClient from "@/api/client";
import useQuery from "@/composables/useQuery";

const props = defineProps<{ groupId: number; query: () => void }>();
const { query } = toRefs(props);

interface IUser {
  id: number;
  name: string;
}
const users = ref<IUser[]>([]);
const client = useClient();
const request = client.get("api/rlc_users/");
const userQuery = useQuery(request, users);

const fields = computed<types.FormField[]>(() => [
  {
    label: "User",
    name: "new_member_id",
    type: "combobox",
    required: true,
    options: users.value,
  },
]);

const { commandRequest, commandModalOpen } = useCmd(query.value);

watch(commandModalOpen, (newValue) => {
  if (newValue) userQuery();
});
</script>
