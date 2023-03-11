<template>
  <ButtonNormal kind="action" @click="addAddressModalOpen = true">
    Add Address
    <ModalCreate
      v-model="addAddressModalOpen"
      :request="addAddress"
      :fields="addressFields"
      :data="{ group: groupUuid }"
      @change="changed($event)"
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
    {
      label: "Result",
      name: "ignore",
      type: "text",
      disabled: true,
      required: true,
    },
  ] as types.FormField[];
});

const changed = (data: types.JsonModel) => {
  let domainName = "";
  const domain = availableDomains?.value.find((i) => i.uuid === data.domain);
  if (domain) domainName = domain.name;
  let localpart = "";
  if (data.localpart) localpart = data.localpart;
  if (!domainName && !localpart) data.ignore = "";
  else data.ignore = `${localpart}@${domainName}`;
};

const { commandRequest: addAddress, commandModalOpen: addAddressModalOpen } =
  useCommand(mailGroupAddAddress, query.value);
</script>
