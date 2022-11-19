<template>
  <TableGenerator
    :head="[
      { name: 'User', key: (o) => o.account.user.name },
      { name: 'Mail', key: (o) => `${o.localpart}@${o.domain.name}` },
      { name: 'Default', key: 'is_default' },
      //   { name: '', key: 'action' },
    ]"
    :data="addresses"
  >
    <!-- <template #head-action>
      <div class="flex justify-end">
        <ButtonNormal
          size="xs"
          kind="action"
          @click="actionsMailUser.addAddressModalOpen = true"
        >
          Add Address
        </ButtonNormal>
      </div>
    </template> -->
    <!-- <template #action="item">
      <div class="flex justify-end space-x-3">
        <ButtonNormal
          size="xs"
          kind="action"
          @click="
            actionsMailUser.temporary = item;
            actionsMailUser.setDefaultAddressModalOpen = true;
          "
        >
          Set as default
        </ButtonNormal>
        <ButtonNormal
          size="xs"
          kind="delete"
          @click="
            actionsMailUser.temporary = item;
            actionsMailUser.deleteAddressModalOpen = true;
          "
        >
          Delete
        </ButtonNormal>
      </div>
    </template> -->
  </TableGenerator>
</template>

<script setup lang="ts">
import { MailAddress, MailDashboardPage, NoMailAccount } from "@/types/mail";
import { TableGenerator } from "@lawandorga/components";
import { computed, PropType, toRefs } from "vue";

// page
const props = defineProps({
  page: {
    required: true,
    type: Object as PropType<MailDashboardPage | NoMailAccount>,
  },
});
const { page } = toRefs(props);

// addresses
const addresses = computed<MailAddress[] | null>(() => {
  if (page.value && !page.value.noMailAccount) return page.value.addresses;
  return null;
});
</script>
