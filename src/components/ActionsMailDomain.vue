<template>
  <ModalCreate
    v-model="commandModalOpen"
    title="Add a domain"
    submit="Add"
    :fields="fields"
    :request="commandRequest"
  />
  <ModalUpdate
    v-model="changeDomainModalOpen"
    title="Change domain"
    submit="Save"
    :fields="fields"
    :request="changeDomainRequest"
    :initial="temporary"
  />
</template>

<script setup lang="ts">
import useCommand from "@/composables/useCommand";
import { mailAddDomain, mailChangeDomain } from "@/services/mail";
import { ModalCreate, ModalUpdate, types } from "@lawandorga/components";
import { PropType, toRefs } from "vue";

// page
const props = defineProps({
  queryPage: {
    type: Function as PropType<() => void>,
    required: true,
  },
});
const { queryPage } = toRefs(props);

// add domain
const fields: types.FormField[] = [
  {
    label: "Domain",
    name: "name",
    type: "text",
    required: true,
    helptext: "For example: mail.law-orga.de",
  },
];
const { commandModalOpen, commandRequest } = useCommand(
  mailAddDomain,
  queryPage.value,
);

// change domain
const {
  commandModalOpen: changeDomainModalOpen,
  commandRequest: changeDomainRequest,
  temporary,
} = useCommand(mailChangeDomain, queryPage.value);

// expose
defineExpose({ commandModalOpen, changeDomainModalOpen, temporary });
</script>
