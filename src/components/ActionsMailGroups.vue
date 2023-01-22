<template>
  <ModalCreate
    v-model="addAddressModalOpen"
    :request="addAddress"
    :fields="addressFields"
    :data="{ group: groupId }"
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
    :data="{ address: temporary?.uuid, group: groupId }"
    :request="deleteAddress"
  >
    Are you sure you want to delete {{ temporary?.localpart }}@{{
      temporary?.domain.name
    }}?
  </ModalDelete>
  <ModalForm
    v-model="addMemberModalOpen"
    :fields="addMemberFields"
    :request="addMemberRequest"
    :data="{ group: groupId }"
    title="Add member"
    submit="Add"
  />
  <ModalConfirm
    v-model="removeMemberModalOpen"
    :request="removeMemberRequest"
    :data="{ group: groupId, member: temporary?.uuid }"
    title="Remove member"
    submit="Remove"
  >
    Are you sure you want to remove {{ temporary?.name }} from this group?
  </ModalConfirm>
</template>

<script setup lang="ts">
import useCommand from "@/composables/useCommand";
import {
  mailGroupAddAddress,
  mailGroupAddMember,
  mailGroupDeleteAddress,
  mailGroupRemoveMember,
  mailGroupSetDefaultAddress,
} from "@/services/mail";
import { IAvailableMailDomain, IMailUser } from "@/types/mail";
import {
  ModalConfirm,
  ModalCreate,
  ModalDelete,
  ModalForm,
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
    type: Object as PropType<IAvailableMailDomain[]>,
  },
  availableUsers: {
    required: false,
    type: Array as PropType<IMailUser[]>,
    default: () => [],
  },
});
const { availableDomains, query, availableUsers } = toRefs(props);

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

// add member
const {
  commandRequest: addMemberRequest,
  commandModalOpen: addMemberModalOpen,
} = useCommand(mailGroupAddMember, query.value);
const addMemberFields = computed<types.FormField[]>(() => [
  {
    label: "Member",
    name: "member",
    type: "select",
    required: true,
    options: availableUsers.value,
  },
]);

// remove member
const {
  commandRequest: removeMemberRequest,
  commandModalOpen: removeMemberModalOpen,
  temporary,
} = useCommand(mailGroupRemoveMember, query.value);

// expose
defineExpose({
  addAddressModalOpen,
  deleteAddressModalOpen,
  setDefaultAddressModalOpen,
  addMemberModalOpen,
  temporary,
  removeMemberModalOpen,
});
</script>
