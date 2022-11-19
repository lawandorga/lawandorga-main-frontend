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
    title="Set Default Address"
  >
    Do you want to set {{ temporary?.localpart }}@{{ temporary?.domain.name }}
    as default? Be aware that your IMAP and SMTP settings will change.
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
  <ModalConfirm
    v-model="regeneratePasswordModalOpen"
    :request="regeneratePassword"
    title="Regenerate Password"
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
</template>

<script setup lang="ts">
import useCommand from "@/composables/useCommand";
import {
  mailCreateUser,
  mailAddAddress,
  mailDeleteAddress,
  mailSetDefaultAddress,
  mailRegeneratePassword,
} from "@/services/mail";
import {
  MailDashboardPage,
  MailAddress,
  MailUser,
  NoMailAccount,
} from "@/types/mail";
import {
  ModalConfirm,
  ModalCreate,
  ModalDelete,
  types,
} from "@lawandorga/components";
import { computed, PropType, ref, toRefs } from "vue";

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

// create mail user
const { commandRequest: createMailUserRole } = useCommand(
  mailCreateUser,
  queryPage.value,
);

// user
const user = computed<MailUser | null | false>(() => {
  if (page.value == undefined) return null;
  else if (page.value.noMailAccount) return false;
  return page.value.user;
});

// addresses
const addresses = computed<MailAddress[] | null>(() => {
  if (user.value === null || user.value === false) return null;
  return user.value.account.addresses;
});

// create address
const fields = computed<types.FormField[]>(() => {
  if (page.value.noMailAccount) return [];
  return [
    { label: "Localpart", name: "localpart", type: "string", required: true },
    {
      label: "Domain",
      name: "domain",
      type: "select",
      required: true,
      options: page.value ? page.value.available_domains : [],
    },
  ] as types.FormField[];
});
const { commandRequest: addAddress, commandModalOpen: addAddressModalOpen } =
  useCommand(mailAddAddress, queryPage.value);

// delete address
const {
  commandRequest: deleteAddress,
  commandModalOpen: deleteAddressModalOpen,
  temporary,
} = useCommand(mailDeleteAddress, queryPage.value);

// set default address
const {
  commandRequest: setDefaultAddress,
  commandModalOpen: setDefaultAddressModalOpen,
} = useCommand(mailSetDefaultAddress, queryPage.value);

// regenerate password
const regeneratePasswordModalOpen = ref(false);
const password = ref("");
const regeneratePassword = () =>
  mailRegeneratePassword().then((d) => (password.value = d.password));

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
  regeneratePasswordModalOpen,
});
</script>
