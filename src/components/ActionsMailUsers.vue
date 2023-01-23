<template>
  <ModalCreate
    v-model="addAddressModalOpen"
    :request="addAddress"
    :fields="addressFields"
    :data="{ user: userId }"
  />

  <ModalDelete
    v-model="deleteAddressModalOpen"
    :data="{ address: temporary?.uuid, user: userId }"
    :request="deleteAddress"
  >
    Are you sure you want to delete {{ temporary?.localpart }}@{{
      temporary?.domain.name
    }}?
  </ModalDelete>
</template>

<script setup lang="ts">
import useCommand from "@/composables/useCommand";
import { mailAddAddress, mailDeleteAddress } from "@/services/mail";
import { IMailDomain } from "@/types/mail";
import { ModalCreate, ModalDelete, types } from "@lawandorga/components";
import { computed, PropType, toRefs } from "vue";

// props
const props = defineProps({
  query: {
    required: true,
    type: Function as PropType<() => void>,
  },
  userId: {
    required: true,
    type: String,
  },
  availableDomains: {
    required: true,
    type: Object as PropType<IMailDomain[]>,
  },
});
const { availableDomains, query } = toRefs(props);

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
  useCommand(mailAddAddress, query.value);

// delete address
const {
  commandRequest: deleteAddress,
  commandModalOpen: deleteAddressModalOpen,
  temporary,
} = useCommand(mailDeleteAddress, query.value);

// expose
defineExpose({
  addAddressModalOpen,
  deleteAddressModalOpen,
  temporary,
});
</script>
