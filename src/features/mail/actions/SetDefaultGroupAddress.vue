<script setup lang="ts">
import useCmd from "@/composables/useCmd";
import { ButtonNormal, ModalConfirm } from "lorga-ui";
import { toRefs } from "vue";

const props = defineProps<{
  query: () => void;
  addressUuid: string;
  email: string;
}>();
const { query } = toRefs(props);

const {
  commandRequest: setDefaultAddress,
  commandModalOpen: setDefaultAddressModalOpen,
} = useCmd(query.value);
</script>

<template>
  <ButtonNormal kind="action" @click="setDefaultAddressModalOpen = true">
    Set as default
    <ModalConfirm
      v-model="setDefaultAddressModalOpen"
      :data="{
        address_uuid: addressUuid,
        action: 'mail/set_default_group_address',
      }"
      :request="setDefaultAddress"
      title="Set Default Address"
    >
      Do you want to set {{ email }} as default? Be aware that your IMAP and
      SMTP settings will change.
    </ModalConfirm>
  </ButtonNormal>
</template>
