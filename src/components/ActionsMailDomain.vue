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
    :data="temporary"
  />
  <ModalFree v-model="checkModalOpen" title="Check Domain Settings">
    <div v-if="check && check.valid">Your settings are correct.</div>
    <div v-else-if="check && !check.valid" class="text-red-700">
      {{ check.wrong_setting }}
    </div>
    <div v-else-if="!check">Loading...</div>
  </ModalFree>
</template>

<script setup lang="ts">
import useCommand from "@/composables/useCommand";
import {
  mailAddDomain,
  mailChangeDomain,
  mailCheckDomain,
} from "@/services/mail";
import { IMailCheckDomain } from "@/types/mail";
import {
  ModalCreate,
  ModalFree,
  ModalUpdate,
  types,
} from "@lawandorga/components";
import { PropType, ref, toRefs } from "vue";

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

// check domain
const check = ref<IMailCheckDomain>();
const checkModalOpen = ref(false);
const checkDomainSettings = (data: { uuid: string }) => {
  check.value = undefined;
  checkModalOpen.value = true;
  mailCheckDomain(data).then((d) => {
    queryPage.value();
    check.value = d;
  });
};

// expose
defineExpose({
  commandModalOpen,
  changeDomainModalOpen,
  temporary,
  checkDomainSettings,
});
</script>
