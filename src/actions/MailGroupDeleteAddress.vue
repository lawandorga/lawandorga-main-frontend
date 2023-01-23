<template>
  <ButtonNormal kind="delete" @click="deleteAddressModalOpen = true">
    Delete
    <ModalDelete
      v-model="deleteAddressModalOpen"
      :data="{ address: addressUuid, group: groupUuid }"
      :request="deleteAddress"
    >
      Are you sure you want to delete {{ email }}?
    </ModalDelete>
  </ButtonNormal>
</template>

<script setup lang="ts">
import useCommand from "@/composables/useCommand";
import { mailGroupDeleteAddress } from "@/services/mail";
import { IAvailableMailDomain } from "@/types/mail";
import { ButtonNormal, ModalDelete } from "@lawandorga/components";
import { toRefs } from "vue";

const props = defineProps<{
  query: () => void;
  email: string;
  groupUuid: string | null;
  addressUuid: string;
  availableDomains: IAvailableMailDomain[];
}>();

const { query } = toRefs(props);

const {
  commandRequest: deleteAddress,
  commandModalOpen: deleteAddressModalOpen,
} = useCommand(mailGroupDeleteAddress, query.value);
</script>
