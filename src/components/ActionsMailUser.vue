<template>
  <ModalCreate
    v-model="addAddressModalOpen"
    :request="addAddress"
    :fields="fields"
    :initial="{ user: user ? user?.id : '' }"
  />
  <ModalConfirm
    v-model="setDefaultAddressModalOpen"
    :data="temporary"
    :request="setDefaultAddress"
  >
    Do you want to set {{ temporary?.localpart }}@{{ temporary?.domain.name }}
    as default? Be aware that your IMAP and SMPT settings will change.
  </ModalConfirm>
  <ModalDelete
    v-model="deleteAddressModalOpen"
    :object="temporary"
    :request="deleteAddress"
  >
    Are you sure you want to delete {{ temporary?.localpart }}@{{
      temporary?.domain.name
    }}?
  </ModalDelete>
</template>

<script setup lang="ts">
import useCommand from "@/composables/useCommand";
import useGet from "@/composables/useGet";
import useQuery from "@/composables/useQuery";
import {
  mailGetPageMail,
  mailCreateUser,
  mailAddAddress,
  mailDeleteAddress,
  mailSetDefaultAddress,
} from "@/services/mail";
import { MailPageMail, MailAddress, MailUser } from "@/types/mail";
import { ModalConfirm, ModalCreate, ModalDelete } from "@lawandorga/components";
import { computed, ref } from "vue";

// get page
const page = ref<MailPageMail | null | false>(null);
useGet(mailGetPageMail, page);

// create mail user
const { commandRequest: createMailUserRole } = useCommand(
  mailCreateUser,
  useQuery(mailGetPageMail, page),
);

// user
const user = computed<MailUser | null | false>(() => {
  if (page.value == null) return null;
  else if (page.value === false) return false;
  return page.value.user;
});

// addresses
const addresses = computed<MailAddress[] | null>(() => {
  if (user.value === null || user.value === false) return null;
  return user.value.account.addresses;
});

// create address
const fields = computed(() => {
  return [
    { label: "Localpart", name: "localpart", type: "string", required: true },
    {
      label: "Domain",
      name: "domain",
      type: "select",
      required: true,
      options: page.value ? page.value.available_domains : [],
    },
  ];
});
const { commandRequest: addAddress, commandModalOpen: addAddressModalOpen } =
  useCommand(mailAddAddress, useQuery(mailGetPageMail, page));

// delete address
const {
  commandRequest: deleteAddress,
  commandModalOpen: deleteAddressModalOpen,
  temporary,
} = useCommand(mailDeleteAddress, useQuery(mailGetPageMail, page));

// set default address
const {
  commandRequest: setDefaultAddress,
  commandModalOpen: setDefaultAddressModalOpen,
} = useCommand(mailSetDefaultAddress, useQuery(mailGetPageMail, page));

// expose
defineExpose({
  page,
  user,
  addresses,
  createMailUserRole,
  addAddressModalOpen,
  temporary,
  deleteAddress,
  deleteAddressModalOpen,
  setDefaultAddressModalOpen,
});
</script>
