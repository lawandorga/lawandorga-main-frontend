<template>
  <div v-if="!!actionsEncryptions">
    <BoxHeadingStats
      title="Access"
      :show="selectedId === 'ACCESS' && selectedType === 'ACCESS'"
      :stats="['The following persons have access to this record']"
      nopadding
    >
      <TableGenerator
        :head="[
          { name: 'Person', key: 'user_detail' },
          { name: 'Since', key: 'created' },
          { name: '', key: 'action' },
        ]"
        :data="actionsEncryptions.encryptions"
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
            Remove Access
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

defineProps<{
  selectedId: number | string;
  selectedType: string;
}>();

const actionsEncryptions = inject(actionsEncryptionsKey);
</script>
