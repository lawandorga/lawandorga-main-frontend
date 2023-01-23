<template>
  <ButtonNormal kind="delete" @click="deleteAddressModalOpen = true">
    Delete
    <ModalDelete
      v-model="deleteAddressModalOpen"
      :data="{ address: addressUuid, user: userUuid }"
      :request="deleteAddress"
    >
      Are you sure you want to delete {{ email }}?
    </ModalDelete>
  </ButtonNormal>
</template>

<script setup lang="ts">
import useCommand from "@/composables/useCommand";
import { mailDeleteAddress } from "@/services/mail";
import { ModalDelete, ButtonNormal } from "@lawandorga/components";
import { toRefs } from "vue";

const props = defineProps<{
  email: string;
  query: () => void;
  userUuid: string | null;
  addressUuid: string;
}>();
const { query } = toRefs(props);

const {
  commandRequest: deleteAddress,
  commandModalOpen: deleteAddressModalOpen,
} = useCommand(mailDeleteAddress, query.value);
</script>
