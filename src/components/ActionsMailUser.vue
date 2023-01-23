<template>
  <ModalCreate
    v-model="addAddressModalOpen"
    :request="addAddress"
    :fields="fields"
    :data="{ user: user?.uuid }"
  />
  <ModalDelete
    v-model="deleteAddressModalOpen"
    :data="{ user: user?.uuid, address: temporary?.uuid }"
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
    submit="Regenerate Password"
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
  mailRegeneratePassword,
} from "@/services/mail";
import { IAvailableMailDomain, ISelfMailUser } from "@/types/mail";
import {
  ModalConfirm,
  ModalCreate,
  ModalDelete,
  types,
} from "@lawandorga/components";
import { computed, PropType, ref, toRefs, watch } from "vue";

// page
const props = defineProps({
  availableDomains: {
    required: false,
    type: Object as PropType<IAvailableMailDomain[]>,
  },
  user: {
    required: false,
    type: Object as PropType<ISelfMailUser>,
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

// regenerate password
const regeneratePasswordModalOpen = ref(false);
const password = ref("");
const regeneratePassword = () =>
  mailRegeneratePassword().then((d) => (password.value = d.password));
watch(regeneratePasswordModalOpen, (newValue) => {
  if (!newValue) password.value = "";
});

// expose
defineExpose({
  temporary,
  createMailUserRole,
  addAddressModalOpen,
  deleteAddressModalOpen,
  regeneratePasswordModalOpen,
});
</script>
