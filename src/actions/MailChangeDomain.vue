<template>
  <ButtonNormal kind="action" @click="changeDomainModalOpen = true">
    Change The Domain
    <ModalUpdate
      v-model="changeDomainModalOpen"
      title="Change domain"
      submit="Save"
      :fields="fields"
      :request="changeDomainRequest"
      :data="{ name: domainName, uuid: domainUuid }"
    />
  </ButtonNormal>
</template>

<script setup lang="ts">
import useCommand from "@/composables/useCommand";
import { mailChangeDomain } from "@/services/mail";
import { ButtonNormal, ModalUpdate, types } from "@lawandorga/components";
import { toRefs } from "vue";

const props = defineProps<{
  domainUuid: string;
  domainName: string;
  query: () => void;
}>();

const { query, domainUuid, domainName } = toRefs(props);

const fields: types.FormField[] = [
  {
    label: "Domain",
    name: "name",
    type: "text",
    required: true,
    helptext: "For example: mail.law-orga.de",
  },
];

const {
  commandModalOpen: changeDomainModalOpen,
  commandRequest: changeDomainRequest,
} = useCommand(mailChangeDomain, query.value);
</script>
