<template>
  <ModalCreate
    v-model="createModalOpen"
    :request="createRequest"
    :fields="fields"
    title="Create Group"
  />
  <ModalDelete
    v-model="deleteModalOpen"
    title="Delete Group"
    :object="{ group: temporary?.uuid }"
    :request="deleteRequest"
  />
  <ModalCreate
    v-model="addAddressModalOpen"
    :request="addAddress"
    :fields="addressFields"
    :initial="{ group: groupId }"
  />
  <ModalConfirm
    v-model="setDefaultAddressModalOpen"
    :data="{ address: temporary?.uuid, group: groupId }"
    :request="setDefaultAddress"
    title="Set Default Address"
  >
    Do you want to set {{ temporary?.localpart }}@{{ temporary?.domain.name }}
    as default? Be aware that your IMAP and SMTP settings will change.
  </ModalConfirm>
  <ModalDelete
    v-model="deleteAddressModalOpen"
    :object="{ address: temporary?.uuid, group: groupId }"
    :request="deleteAddress"
  >
    Are you sure you want to delete {{ temporary?.localpart }}@{{
      temporary?.domain.name
    }}?
  </ModalDelete>
</template>

<script setup lang="ts">
import useCommand from "@/composables/useCommand";
import {
  mailCreateGroup,
  mailDeleteGroup,
  mailGroupAddAddress,
  mailGroupDeleteAddress,
  mailGroupSetDefaultAddress,
} from "@/services/mail";
import { IMailDomain } from "@/types/mail";
import {
  ModalConfirm,
  ModalCreate,
  ModalDelete,
  types,
} from "@lawandorga/components";
import { computed, PropType, toRefs } from "vue";

// props
const props = defineProps({
  query: {
    required: true,
    type: Function as PropType<() => void>,
  },
  groupId: {
    required: false,
    type: String,
  },
  availableDomains: {
    required: true,
    type: Object as PropType<IMailDomain[]>,
  },
});
const { availableDomains, query } = toRefs(props);

// create group
const fields = computed<types.FormField[]>(() => {
  return [
    { label: "Localpart", name: "localpart", type: "string", required: true },
    {
      label: "Domain",
      name: "domain",
      type: "select",
      required: true,
      options: availableDomains?.value as types.FormField["options"],
    },
  ] as types.FormField[];
});
const { commandRequest: createRequest, commandModalOpen: createModalOpen } =
  useCommand(mailCreateGroup, query.value);

// delete group
const {
  commandRequest: deleteRequest,
  commandModalOpen: deleteModalOpen,
  temporary,
} = useCommand(mailDeleteGroup, query.value);

// create address
const addressFields = computed<types.FormField[]>(() => {
  return [
    { label: "Localpart", name: "localpart", type: "string", required: true },
    {
      label: "Domain",
      name: "domain",
      type: "select",
      required: true,
      options: availableDomains?.value as types.FormField["options"],
    },
  ] as types.FormField[];
});
const { commandRequest: addAddress, commandModalOpen: addAddressModalOpen } =
  useCommand(mailGroupAddAddress, query.value);

// delete address
const {
  commandRequest: deleteAddress,
  commandModalOpen: deleteAddressModalOpen,
} = useCommand(mailGroupDeleteAddress, query.value);

// set default address
const {
  commandRequest: setDefaultAddress,
  commandModalOpen: setDefaultAddressModalOpen,
} = useCommand(mailGroupSetDefaultAddress, query.value);

// expose
defineExpose({
  addAddressModalOpen,
  deleteAddressModalOpen,
  setDefaultAddressModalOpen,
  createModalOpen,
  deleteModalOpen,
  temporary,
});
</script>
