<template>
  <ModalCreate
    v-model="addAddressModalOpen"
    :request="addAddress"
    :fields="fields"
    :initial="{ user: user?.id }"
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
import { MailDomain, MailUser } from "@/types/mail";
import {
  ModalConfirm,
  ModalCreate,
  ModalDelete,
  types,
} from "@lawandorga/components";
import { computed, PropType, ref, toRefs } from "vue";

// page
const props = defineProps({
  availableDomains: {
    required: false,
    type: Object as PropType<MailDomain[]>,
  },
  user: {
    required: false,
    type: Object as PropType<MailUser>,
  },
  queryPage: {
    type: Function as PropType<() => void>,
    required: true,
  },
});
const { availableDomains, queryPage, user } = toRefs(props);

// create mail user
const { commandRequest: createMailUserRole } = useCommand(
  mailCreateUser,
  queryPage.value,
);

// create address
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
  temporary,
  createMailUserRole,
  addAddressModalOpen,
  deleteAddressModalOpen,
  setDefaultAddressModalOpen,
  regeneratePasswordModalOpen,
});
</script>
