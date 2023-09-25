<template>
  <ButtonNormal kind="action" @click="setDefaultAddressModalOpen = true">
    Set as default
    <ModalConfirm
      v-model="setDefaultAddressModalOpen"
      :data="{ address: addressUuid, user: userUuid, group: groupUuid }"
      :request="setDefaultAddress"
      title="Set Default Address"
    >
      Do you want to set {{ email }} as default? Be aware that your IMAP and
      SMTP settings will change.
    </ModalConfirm>
  </ButtonNormal>
</template>

<script setup lang="ts">
import useCommand from "@/composables/useCommand";
import { mailSetDefaultAddress } from "@/services/mail";
import { ButtonNormal, ModalConfirm } from "lorga-ui";
import { toRefs } from "vue";

const props = defineProps<{
  query: () => void;
  userUuid?: string | null;
  groupUuid?: string;
  addressUuid: string;
  email: string;
}>();
const { query } = toRefs(props);

const {
  commandRequest: setDefaultAddress,
  commandModalOpen: setDefaultAddressModalOpen,
} = useCommand(mailSetDefaultAddress, query.value);
</script>
