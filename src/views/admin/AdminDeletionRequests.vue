<template>
  <BoxLoader :show="true">
    <div class="max-w-screen-xl mx-auto space-y-6">
      <BreadcrumbsBar
        class="lg:col-span-2"
        :base="{ name: 'admin-dashboard' }"
        :pages="[
          {
            name: 'Deletion-Requests',
            to: { name: 'admin-recorddeletionrequests' },
          },
        ]"
      >
        <CogIcon class="w-6 h-6" />
      </BreadcrumbsBar>
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
            <RecordsAcceptDeletion :id="slotProps.id" :query="query" />
            <RecordsDeclineDeletion :id="slotProps.id" :query="query" />
          </template>
        </template>
      </TableGenerator>
    </div>
  </BoxLoader>
</template>

<script lang="ts" setup>
import { Ref, ref } from "vue";
import { recordsGetDeletions } from "@/services/records";
import BoxLoader from "@/components/BoxLoader.vue";
import { TableGenerator } from "@lawandorga/components";
import useGet from "@/composables/useGet";
import { RecordDeletion } from "@/types/records";
import { formatDate } from "@/utils/date";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { CogIcon } from "@heroicons/vue/24/outline";
import RecordsDeclineDeletion from "@/actions/RecordsDeclineDeletion.vue";
import RecordsAcceptDeletion from "@/actions/RecordsAcceptDeletion.vue";

const deletionRequests = ref(null) as Ref<RecordDeletion[] | null>;

const query = useGet(recordsGetDeletions, deletionRequests);
</script>
