<template>
  <ButtonNormal kind="action" @click="addAddressModalOpen = true">
    Add Address
    <ModalCreate
      v-model="addAddressModalOpen"
      :request="addAddress"
      :fields="addressFields"
      :data="{ group: groupUuid }"
    />
  </ButtonNormal>
</template>

<script setup lang="ts">
import useCommand from "@/composables/useCommand";
import { mailGroupAddAddress } from "@/services/mail";
import { IAvailableMailDomain } from "@/types/mail";
import { ButtonNormal, ModalCreate, types } from "@lawandorga/components";
import { computed, toRefs } from "vue";

const props = defineProps<{
  query: () => void;
  groupUuid: string | null;
  availableDomains: IAvailableMailDomain[];
}>();

const { availableDomains, query } = toRefs(props);

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
</script>
