<template>
  <BoxLoader :show="true">
    <div class="max-w-screen-lg mx-auto space-y-6">
      <BreadcrumbsBar
        class="lg:col-span-2"
        :base="{ name: 'admin-dashboard' }"
        :pages="[
          {
            name: 'Access-Requests',
            to: { name: 'admin-recordpermitrequests' },
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
          { name: 'Processed', key: 'processed_on' },
          { name: 'Processed By', key: 'processed_by_detail' },
          { name: 'State', key: 'state' },
          { name: '', key: 'action' },
        ]"
        :data="accesses"
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
          <RecordsGrantAccess
            v-if="slotProps.state === 're'"
            :id="slotProps.id"
            :recordname="slotProps.record_detail"
            :username="slotProps.requested_by_detail"
            :query="query"
          />
          <RecordsDeclineAccess
            v-if="slotProps.state === 're'"
            :id="slotProps.id"
            :username="slotProps.requested_by_detail"
            :recordname="slotProps.record_detail"
            :query="query"
          />
        </template>
      </TableGenerator>
    </div>
  </BoxLoader>
</template>

<script lang="ts" setup>
import { Ref, ref } from "vue";
import { recordsGetAccessesPage } from "@/services/records";
import BoxLoader from "@/components/BoxLoader.vue";
import { TableGenerator } from "lorga-ui";
import useGet from "@/composables/useGet";
import { IRecordAccess } from "@/types/records";
import { formatDate } from "@/utils/date";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { CogIcon } from "@heroicons/vue/24/outline";
import RecordsGrantAccess from "@/actions/RecordsGrantAccess.vue";
import RecordsDeclineAccess from "@/actions/RecordsDeclineAccess.vue";

const accesses = ref(null) as Ref<IRecordAccess[] | null>;
const query = useGet(recordsGetAccessesPage, accesses);
</script>
