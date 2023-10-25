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
          ...views.map((view) => ({ name: view.name, key: view.name })),
          { spacer: true },
          { name: 'Views', key: 'settings' },
          {
            name: 'Access-Requests',
            key: 'accessRequests',
            badge: accessRequestsBadge,
          },
          {
            name: 'Deletion-Requests',
            key: 'deletions',
            badge: deletionsBadge,
          },
          { name: 'Record-Permissions', key: 'recordPermissions' },
        ]"
      >
        <template v-for="view in views" :key="view.uuid" #[view.name]>
          <TableRecordsV2 :records="records" :columns="view.columns">
            <template #head-action>
              <RecordsCreateRecordV2 :query="query" />
            </template>
            <template #action="{ record }">
              <div class="flex items-center justify-end space-x-3">
                <CreateAccessRequest
                  v-if="!record.has_access"
                  :record-uuid="record.uuid"
                  :query="query"
                />
                <CreateDeletion :record-uuid="record.uuid" :query="query" />
              </div>
            </template>
          </TableRecordsV2>
        </template>
        <template #settings>
          <SettingsViews :query="query" :views="views" />
        </template>
        <template #deletions>
          <DeletionRequests
            :query="query"
            :deletion-requests="deletionRequests"
          />
        </template>
        <template #accessRequests>
          <AccessRequests :query="query" :access-requests="accessRequests" />
        </template>
        <template #recordPermissions>
          <RecordsPermissionsTable />
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
import RecordsPermissionsTable from "@/features/records/components/RecordsPermissionsTable.vue";
import { useUserStore } from "@/store/user";
import RecordsCreateRecordV2 from "@/features/records/actions/RecordsCreateRecordV2.vue";
import useClient from "@/api/client";
import TabControls from "@/components/TabControls.vue";
import { IRecordListPageV2 } from "../types/recordListPageV2";
import { IListRecordV2 } from "../types/listRecordV2";
import SettingsViews from "../components/SettingsViews.vue";
import { IView } from "../types/view";
import CreateDeletion from "../actions/CreateDeletion.vue";
import DeletionRequests from "../components/DeletionRequests.vue";
import { IDeletion } from "../types/deletion";
import AccessRequests from "../components/AccessRequests.vue";
import { IAccessRequest } from "../types/accessRequest";
import CreateAccessRequest from "../actions/CreateAccessRequest.vue";
import RecordsPermissions from "@/components/RecordsPermissions.vue";

const client = useClient();
const request = client.get("/api/records/query/dashboard/");

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

const deletionRequests = computed<IDeletion[]>(() => {
  if (page.value === null) return [];
  return page.value.deletions;
});

const accessRequests = computed<IAccessRequest[]>(() => {
  if (page.value === null) return [];
  return page.value.access_requests;
});

const accessRequestsBadge = computed<number>(() => {
  if (page.value === null) return 0;
  return page.value.badges.access_requests;
});

const deletionsBadge = computed<number>(() => {
  if (page.value === null) return 0;
  return page.value.badges.deletion_requests;
});

const userStore = useUserStore();
</script>
