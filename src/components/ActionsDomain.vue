<template>
  <ModalCreate
    v-model="commandModalOpen"
    title="Add a domain"
    submit="Add"
    :fields="fields"
    :request="commandRequest"
  />
</template>

<script setup lang="ts">
import useCommand from "@/composables/useCommand";
import { mailAddDomain } from "@/services/mail";
import { MailDashboardPage, MailDomain, NoMailAccount } from "@/types/mail";
import { ModalCreate, types } from "@lawandorga/components";
import { computed, PropType, toRefs } from "vue";

// page
const props = defineProps({
  page: {
    required: true,
    type: Object as PropType<MailDashboardPage | NoMailAccount>,
  },
  queryPage: {
    type: Function as PropType<() => void>,
    required: true,
  },
});
const { page, queryPage } = toRefs(props);

// domain
const domain = computed<MailDomain | null>(() => {
  if (page.value && !page.value.noMailAccount) return page.value.domain;
  return null;
});

// add domain
const fields: types.FormField[] = [
  {
    label: "Domain",
    name: "domain",
    type: "text",
    required: true,
    helptext: "For example: mail.law-orga.de",
  },
];
const { commandModalOpen, commandRequest } = useCommand(
  mailAddDomain,
  queryPage.value,
);

// expose
defineExpose({ commandModalOpen, domain });
</script>
