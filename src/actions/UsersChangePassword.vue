<template>
  <ButtonNormal kind="action" @click="changePasswordModalOpen = true">
    Change Password
    <ModalForm
      v-model="changePasswordModalOpen"
      title="Change Password"
      :request="changePasswordRequest"
      :fields="passwordFields"
    />
  </ButtonNormal>
</template>

<script setup lang="ts">
import useClient from "@/api/client";
import useCommand from "@/composables/useCommand";
import { ButtonNormal, ModalForm, types } from "@lawandorga/components";
import { toRefs } from "vue";

const props = defineProps<{
  query: () => void;
}>();
const { query } = toRefs(props);

const client = useClient();

const request = client.post("api/users/change_password/");

const passwordFields: types.FormField[] = [
  {
    label: "Current Password",
    type: "password",
    name: "current_password",
    required: true,
  },
  {
    label: "New Password",
    type: "password",
    name: "new_password",
    required: true,
  },
  {
    label: "New Password Confirm",
    type: "password",
    name: "new_password_confirm",
    required: true,
  },
];

const {
  commandModalOpen: changePasswordModalOpen,
  commandRequest: changePasswordRequest,
} = useCommand(request, query.value);
</script>
