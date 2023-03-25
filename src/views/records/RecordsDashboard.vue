<template>
  <BoxLoader :show="userStore.loaded">
    <div v-if="userStore.loaded" class="mx-auto space-y-6 max-w-screen-2xl">
      <BreadcrumbsBar :base="{ name: 'records-dashboard' }" :pages="[]">
        <RectangleStackIcon class="w-6 h-6" />
        <template #buttons>
          <RecordsPermissions />
        </template>
      </BreadcrumbsBar>
      <TableRecordsV2 :records="records" :columns="page?.columns">
        <template #head-action>
          <RecordsCreateRecordV2 :query="query" />
        </template>
        <!-- <template #action="slotProps">
          <div class="flex items-center justify-end space-x-3">
            <RecordsCreateAccess
              v-if="!slotProps.record.has_access"
              :query="query"
              :record-id="slotProps.record.id"
            />
            <RecordsCreateDeletion
              v-if="!slotProps.record.delete_requested"
              :record-id="slotProps.record.id"
              :query="query"
            />
          </div>
        </template> -->
      </TableRecordsV2>
    </div>
  </BoxLoader>
  <button type="button" @click="requery">requery</button>
</template>

<script lang="ts" setup>
import TableRecordsV2 from "@/components/TableRecordsV2.vue";
import BoxLoader from "@/components/BoxLoader.vue";
import { computed, ref } from "vue";
import { IListRecordV2, IRecordListPageV2 } from "@/types/records";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { RectangleStackIcon } from "@heroicons/vue/24/outline";
import useGet from "@/composables/useGet";
import RecordsPermissions from "@/components/RecordsPermissions.vue";
import { useUserStore } from "@/store/user";
import RecordsCreateRecordV2 from "@/actions/RecordsCreateRecordV2.vue";
import useClient from "@/api/client";

const client = useClient();
const request = client.get("/api/records/v2/query/dashboard/");

const page = ref<IRecordListPageV2 | null>(null);
const query = useGet(request, page);

const requery = () => query();

const records = computed<IListRecordV2[] | null>(() => {
  if (page.value === null) return null;
  return page.value.records;
});

const userStore = useUserStore();
</script>
