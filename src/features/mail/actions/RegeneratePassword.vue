<script setup lang="ts">
import { mailRegeneratePassword } from "@/features/mail/mail";
import { ButtonNormal, ModalConfirm } from "lorga-ui";
import { ref, watch } from "vue";

const regeneratePasswordModalOpen = ref(false);
const password = ref("");
const regeneratePassword = () =>
  mailRegeneratePassword().then((d) => (password.value = d.password));
watch(regeneratePasswordModalOpen, (newValue) => {
  if (!newValue) password.value = "";
});
</script>

<template>
  <ButtonNormal kind="secondary" @click="regeneratePasswordModalOpen = true">
    Regenerate password
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
  </ButtonNormal>
</template>
