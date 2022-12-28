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
  <ModalFree
    v-model="checkModalOpen"
    title="Check Domain Settings"
    @update:model-value="check = undefined"
  >
    <div v-if="check && check.error">
      An error happened: {{ check.message }}
    </div>
    <div v-else-if="check && check.valid">
      Your MX-Records Settings are correct.
    </div>
    <div v-else-if="check && !check.valid" class="text-red-700">
      The following record settings are not correct:
      <br />
      <span class="font-mono text-xs italic">
        Type: {{ check.wrong_setting["type"] }}
        <br />
        Host: {{ check.wrong_setting["host"] }}
        <br />
        Destination Check: {{ check.wrong_setting["check"] }}
      </span>
      <br />
      <br />
      Your settings are the following:
      <br />
      <span class="font-mono text-xs italic">
        {{ check.mx_records.join(", ") }}
      </span>
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
const check = ref<IMailCheckDomain | { error: true; message: string }>();
const checkModalOpen = ref(false);
const checkDomainSettings = (data: { uuid: string }) => {
  checkModalOpen.value = true;
  mailCheckDomain(data)
    .then((d) => {
      queryPage.value();
      check.value = { ...d, error: false };
    })
    .catch((e) => {
      console.log(e);
      check.value = { error: true, message: e.response.data.title };
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
