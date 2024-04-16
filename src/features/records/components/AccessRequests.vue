<template>
  <TableGenerator
    :head="[
      { name: 'Record', key: 'record_detail' },
      { name: 'Requested', key: 'created' },
      { name: 'Requested By', key: 'requested_by_detail' },
      { name: 'Explanation', key: 'explanation' },
      { name: 'Processed', key: 'processed_on' },
      { name: 'Processed By', key: 'processed_by_detail' },
      { name: 'State', key: 'state' },
      { name: '', key: 'action' },
    ]"
    :data="accessRequests"
  >
    <template #created="slotProps">
      {{ formatDate(slotProps.created) }}
    </template>
    <template #processed_on="slotProps">
      {{ formatDate(slotProps.processed_on) }}
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
      <GrantAccessRequest
        v-if="slotProps.state === 're'"
        :access-request-uuid="slotProps.uuid"
        :recordname="slotProps.record_detail"
        :username="slotProps.requested_by_detail"
        :query="query"
      />
      <DeclineAccessRequest
        v-if="slotProps.state === 're'"
        :access-request-uuid="slotProps.uuid"
        :username="slotProps.requested_by_detail"
        :recordname="slotProps.record_detail"
        :query="query"
      />
    </template>
  </TableGenerator>
</template>

<script lang="ts" setup>
import { TableGenerator } from "lorga-ui";
import { formatDate } from "@/utils/date";
import { AccessRequest } from "../types/accessRequest";
import DeclineAccessRequest from "../actions/DeclineAccessRequest.vue";
import GrantAccessRequest from "../actions/GrantAccessRequest.vue";

defineProps<{
  accessRequests: AccessRequest[];
  query: () => void;
}>();
</script>
