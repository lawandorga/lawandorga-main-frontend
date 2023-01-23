<template>
  <ModalConfirm
    v-model="regeneratePasswordModalOpen"
    :request="regeneratePassword"
    title="Regenerate Password"
    submit="Regenerate Password"
  >
    Do you want to generate a new password? Be aware that your IMAP and SMTP
    settings will change.
    <br />
    Please store the password somewhere safe. You can only see it once.
    <br />
    <br />
    <span v-if="password">
      Your new password is:
      <br />
      {{ password }}
    </span>
  </ModalConfirm>
</template>

<script setup lang="ts">
import useCommand from "@/composables/useCommand";
import { mailCreateUser, mailRegeneratePassword } from "@/services/mail";
import { ISelfMailUser } from "@/types/mail";
import { ModalConfirm } from "@lawandorga/components";
import { PropType, ref, toRefs, watch } from "vue";

// page
const props = defineProps({
  user: {
    required: false,
    type: Object as PropType<ISelfMailUser>,
  },
  queryPage: {
    type: Function as PropType<() => void>,
    required: true,
  },
});
const { queryPage } = toRefs(props);

// create mail user
const { commandRequest: createMailUserRole, temporary } = useCommand(
  mailCreateUser,
  queryPage.value,
);

// regenerate password
const regeneratePasswordModalOpen = ref(false);
const password = ref("");
const regeneratePassword = () =>
  mailRegeneratePassword().then((d) => (password.value = d.password));
watch(regeneratePasswordModalOpen, (newValue) => {
  if (!newValue) password.value = "";
});

// expose
defineExpose({
  temporary,
  createMailUserRole,
  regeneratePasswordModalOpen,
});
</script>
