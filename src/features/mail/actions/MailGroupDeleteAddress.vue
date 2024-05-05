<template>
  <ButtonNormal kind="delete" @click="deleteAddressModalOpen = true">
    Delete
    <ModalDelete
      v-model="deleteAddressModalOpen"
      :data="{ address_uuid: addressUuid, action: 'mail/delete_group_address' }"
      :request="deleteAddress"
    >
      Are you sure you want to delete {{ email }}?
    </ModalDelete>
  </ButtonNormal>
</template>

<script setup lang="ts">
import useCmd from "@/composables/useCmd";
import { ButtonNormal, ModalDelete } from "lorga-ui";
import { toRefs } from "vue";
import { MailDomain } from "../api/useGetGroupPage";

const props = defineProps<{
  query: () => void;
  email: string;
  addressUuid: string;
  availableDomains: MailDomain[];
}>();

const { query } = toRefs(props);

const {
  commandRequest: deleteAddress,
  commandModalOpen: deleteAddressModalOpen,
} = useCmd(query.value);
</script>
