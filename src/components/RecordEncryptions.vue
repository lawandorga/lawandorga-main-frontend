<template>
  <div v-if="!!actionsEncryptions">
    <BoxHeadingStats
      title="Access"
      :show="selectedType === 'ACCESS'"
      :stats="[
        'The following persons have access to this record because they have access to its folder.',
      ]"
      nopadding
    >
      <TableGenerator
        :head="[
          { name: 'Person', key: 'name' },
          // { name: 'Since', key: 'created' },
          { name: '', key: 'action' },
        ]"
        :data="access"
      >
        <template #created="slotProps">
          {{ formatDate(slotProps.created) }}
        </template>
        <template #action="slotProps">
          <ButtonNormal
            kind="delete"
            @click="
              actionsEncryptions.temporary = slotProps;
              actionsEncryptions.deleteModalOpen = true;
            "
          >
            Revoke Access
          </ButtonNormal>
        </template>
      </TableGenerator>
    </BoxHeadingStats>
  </div>
</template>

<script lang="ts" setup>
import BoxHeadingStats from "./BoxHeadingStats.vue";
import { TableGenerator, ButtonNormal } from "@lawandorga/components";
import { actionsEncryptionsKey } from "@/types/keys";
import { formatDate } from "@/utils/date";
import { inject } from "vue";
import { IAccess } from "@/types/folders";

defineProps<{
  selectedType: string;
  access: IAccess[] | null;
}>();

const actionsEncryptions = inject(actionsEncryptionsKey);
</script>
