<template>
  <TableGenerator
    :head="[
      { name: 'Record', key: 'record_detail' },
      { name: 'Requested', key: 'created' },
      { name: 'Requested By', key: 'requested_by_detail' },
      { name: 'Explanation', key: 'explanation' },
      { name: 'Processed', key: 'processed' },
      { name: 'Processed By', key: 'processed_by_detail' },
      { name: 'State', key: 'state' },
      { name: '', key: 'action' },
    ]"
    :data="deletionRequests"
  >
    <template #created="slotProps">
      {{ formatDate(slotProps.created) }}
    </template>
    <template #processed="slotProps">
      {{ formatDate(slotProps.processed) }}
    </template>
    <template #state="slotProps">
      <span v-if="slotProps.state === 're'">Requested</span>
      <span v-if="slotProps.state === 'de'">Declined</span>
      <span v-if="slotProps.state === 'gr'">Accepted</span>
    </template>
    <template #explanation="slotProps">
      <div class="w-40 whitespace-normal line-clamp-3">
        <abbr class="underline-dotted" :title="slotProps.explanation">
          {{ slotProps.explanation }}
        </abbr>
      </div>
    </template>
    <template #action="slotProps">
      <template v-if="slotProps.state === 're'">
        <AcceptDeletion :deletion-uuid="slotProps.uuid" :query="query" />
        <DeclineDeletion :deletion-uuid="slotProps.uuid" :query="query" />
      </template>
    </template>
  </TableGenerator>
</template>

<script lang="ts" setup>
import { TableGenerator } from "lorga-ui";
import { formatDate } from "@/utils/date";
import AcceptDeletion from "../actions/AcceptDeletion.vue";
import DeclineDeletion from "../actions/DeclineDeletion.vue";
import { IDeletion } from "../types/deletion";

defineProps<{
  deletionRequests: IDeletion[];
  query: () => void;
}>();
</script>
