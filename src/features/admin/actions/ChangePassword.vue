<template>
  <ButtonNormal v-if="show" kind="secondary" @click="commandModalOpen = true">
    Change Password
    <ModalForm
      v-model="commandModalOpen"
      title="Change Password"
      :request="commandRequest"
      :fields="passwordFields"
      :data="{
        action: 'auth/change_password',
      }"
    />
  </ButtonNormal>
</template>

<script setup lang="ts">
import useCmd from "@/composables/useCmd";
import { useUserStore } from "@/store/user";
import { ButtonNormal, ModalForm, types } from "lorga-ui";
import { computed, toRefs } from "vue";

const props = defineProps<{
  query: () => void;
  userId: number;
}>();
const { query } = toRefs(props);

const store = useUserStore();

const show = computed(() => {
  return props.userId == store.user?.id;
});

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

const { commandModalOpen, commandRequest } = useCmd(query.value);
</script>
