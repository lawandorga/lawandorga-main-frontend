<template><div></div></template>

<script setup lang="ts">
import useCommand from "@/composables/useCommand";
import useGet from "@/composables/useGet";
import useQuery from "@/composables/useQuery";
import { mailGetUser, mailCreateUser } from "@/services/mail";
import { MailUser } from "@/types/mail";
import { ref } from "vue";

const user = ref<MailUser | null>(null);
useGet(mailGetUser, user);

const { commandRequest: createMailUserRole } = useCommand(
  mailCreateUser,
  useQuery(mailGetUser, user),
);

defineExpose({
  user,
  createMailUserRole,
});
</script>
