<template>
  <BoxLoader :show="userStore.loaded">
    <div v-if="userStore.loaded" class="mx-auto space-y-6 max-w-screen-2xl">
      <BreadcrumbsBar :base="{ name: 'records-dashboard' }" :pages="[]">
        <RectangleStackIcon class="w-6 h-6" />
        <template #buttons>
          <RecordsPermissions />
        </template>
      </BreadcrumbsBar>
      <TabControls
        :tabs="[
          { name: 'Default', key: 'default' },
          ...views.map((view) => ({ name: view.name, key: view.name })),
          { name: 'Settings', key: 'settings' },
        ]"
      >
        <template #default>
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
        </template>
        <template v-for="view in views" :key="view.uuid" #[view.name]>
          <TableRecordsV2 :records="records" :columns="view.columns">
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
        </template>
        <template #settings>
          <SettingsViews :query="query" :views="views" />
        </template>
      </TabControls>
    </div>
  </BoxLoader>
</template>

<script lang="ts" setup>
import TableRecordsV2 from "@/features/records/components/TableRecordsV2.vue";
import BoxLoader from "@/components/BoxLoader.vue";
import { computed, ref } from "vue";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { RectangleStackIcon } from "@heroicons/vue/24/outline";
import useGet from "@/composables/useGet";
import RecordsPermissions from "@/components/RecordsPermissions.vue";
import { useUserStore } from "@/store/user";
import RecordsCreateRecordV2 from "@/features/records/actions/RecordsCreateRecordV2.vue";
import useClient from "@/api/client";
import TabControls from "@/components/TabControls.vue";
import { IRecordListPageV2 } from "../types/recordListPageV2";
import { IListRecordV2 } from "../types/listRecordV2";
import SettingsViews from "../components/SettingsViews.vue";
import { IView } from "../types/view";

const client = useClient();
const request = client.get("/api/records/v2/query/dashboard/");

const page = ref<IRecordListPageV2 | null>(null);
const query = useGet(request, page);

const records = computed<IListRecordV2[] | null>(() => {
  if (page.value === null) return null;
  return page.value.records;
});

const views = computed<IView[]>(() => {
  if (page.value === null) return [];
  return page.value.views;
});

const userStore = useUserStore();
</script>
