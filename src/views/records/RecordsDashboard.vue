<template>
  <BoxLoader :show="userStore.loaded">
    <div v-if="userStore.loaded" class="mx-auto space-y-6 max-w-screen-2xl">
      <BreadcrumbsBar :base="{ name: 'records-dashboard' }" :pages="[]">
        <RectangleStackIcon class="w-6 h-6" />
        <template #buttons>
          <RecordsPermissions />
        </template>
      </BreadcrumbsBar>
      <TableRecords :records="records" :columns="page?.columns">
        <template #head-action>
          <RecordsCreateRecord :query="query" />
        </template>
        <template #action="slotProps">
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
        </template>
      </TableRecords>
    </div>
  </BoxLoader>
  <button type="button" @click="requery">requery</button>
</template>

<script lang="ts" setup>
import TableRecords from "@/components/TableRecords.vue";
import BoxLoader from "@/components/BoxLoader.vue";
import { computed, ref } from "vue";
import { IListRecord, IRecordListPage } from "@/types/records";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { RectangleStackIcon } from "@heroicons/vue/24/outline";
import useGet from "@/composables/useGet";
import RecordsPermissions from "@/components/RecordsPermissions.vue";
import { useUserStore } from "@/store/user";
import RecordsCreateDeletion from "@/actions/RecordCreateDeletion.vue";
import RecordsCreateAccess from "@/actions/RecordsCreateAccess.vue";
import RecordsCreateRecord from "@/actions/RecordsCreateRecord.vue";
import useClient from "@/api/client";

const client = useClient();
const request = client.get("/api/records/v2/query/dashboard/");

const page = ref<IRecordListPage | null>(null);
const query = useGet(request, page);

const requery = () => query();

const records = computed<IListRecord[] | null>(() => {
  if (page.value === null) return null;
  return page.value.records;
});

const userStore = useUserStore();
</script>
