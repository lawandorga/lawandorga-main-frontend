<template>
  <ButtonNormal kind="delete" @click="deleteAddressModalOpen = true">
    Delete
    <ModalDelete
      v-model="deleteAddressModalOpen"
      :data="{ address_uuid: addressUuid, action: 'mail/delete_address' }"
      :request="deleteAddress"
    >
      Are you sure you want to delete {{ email }}?
    </ModalDelete>
  </ButtonNormal>
</template>

<script setup lang="ts">
import useCmd from "@/composables/useCmd";
import { ModalDelete, ButtonNormal } from "lorga-ui";
import { toRefs } from "vue";

const props = defineProps<{
  email: string;
  query: () => void;
  addressUuid: string;
}>();
const { query } = toRefs(props);

const {
  commandRequest: deleteAddress,
  commandModalOpen: deleteAddressModalOpen,
} = useCmd(query.value);
</script>
