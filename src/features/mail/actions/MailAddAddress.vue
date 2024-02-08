<template>
  <ButtonNormal kind="action" @click="addAddressModalOpen = true">
    Add Address
    <ModalCreate
      v-model="addAddressModalOpen"
      :request="request"
      :fields="addressFields"
      :data="{ user_uuid: userUuid, action: 'mail/create_address' }"
      @change="changed($event)"
    />
  </ButtonNormal>
</template>

<script setup lang="ts">
import useCmd from "@/composables/useCmd";
import { IAvailableMailDomain } from "@/types/mail";
import { ModalCreate, types, ButtonNormal } from "lorga-ui";
import { computed, toRefs } from "vue";

const props = defineProps<{
  query: () => void;
  userUuid: string | null;
  availableDomains: IAvailableMailDomain[];
}>();

const { availableDomains, query } = toRefs(props);

const addressFields = computed<types.FormField[]>(() => {
  return [
    { label: "Localpart", name: "localpart", type: "string", required: true },
    {
      label: "Domain",
      name: "domain_uuid",
      type: "select",
      required: true,
      options: availableDomains?.value,
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const changed = (data: Record<string, any>) => {
  let domainName = "";
  const domain = availableDomains?.value.find(
    (i) => i.uuid === data.domain_uuid,
  );
  if (domain) domainName = domain.name;
  let localpart = "";
  if (data.localpart) localpart = data.localpart;
  if (!domainName && !localpart) data.ignore = "";
  else data.ignore = `${localpart}@${domainName}`;
};

const { commandRequest: addAddress, commandModalOpen: addAddressModalOpen } =
  useCmd(query.value);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const request = (data: Record<string, any>) => {
  const newData = { ...data };
  delete newData.ignore;
  return addAddress(newData);
};
</script>
