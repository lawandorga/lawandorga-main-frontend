<script lang="ts" setup>
import RecordsTableV3 from "@/features/records/components/RecordsTableV3.vue";
import BoxLoader from "@/components/BoxLoader.vue";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { RectangleStackIcon, XMarkIcon } from "@heroicons/vue/24/outline";
import RecordsPermissionsTable from "@/features/records/components/RecordsPermissionsTable.vue";
import { useUserStore } from "@/store/user";
import RecordsCreateRecordV2 from "@/features/records/actions/RecordsCreateRecordV2.vue";
import TabControls from "@/components/TabControls.vue";
import SettingsViews from "../components/SettingsViews.vue";
import CreateDeletion from "../actions/CreateDeletion.vue";
import DeletionRequests from "../components/DeletionRequests.vue";
import AccessRequests from "../components/AccessRequests.vue";
import CreateAccessRequest from "../actions/CreateAccessRequest.vue";
import RecordsPermissions from "@/components/RecordsPermissions.vue";
import { useRecords } from "../api/useRecords";
import { useInfos } from "../api/useInfos";
import { ButtonNormal, FormInput, PaginationBar } from "lorga-ui";
import { ref } from "vue";

const tokenSearch = ref("");
const yearSearch = ref("");
const generalSearch = ref("");

const resetSearch = () => {
  tokenSearch.value = "";
  yearSearch.value = "";
  generalSearch.value = "";
};

const {
  deletionRequests,
  accessRequests,
  views,
  accessRequestsBadge,
  deletionsBadge,
  query: queryInfos,
} = useInfos();

const {
  records,
  total,
  query: queryRecords,
  queryParams,
  setQueryParam,
} = useRecords(tokenSearch, yearSearch, generalSearch);

const query = () => {
  queryInfos();
  queryRecords();
};

const userStore = useUserStore();
</script>

<template>
  <BoxLoader :show="!!userStore.loaded && !!views.length">
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
          <div
            class="flex flex-wrap gap-3 px-4 py-3 mb-5 border-2 rounded-lg shadow-sm bg-gray-50"
          >
            <FormInput
              :model-value="tokenSearch"
              name="search"
              label="Token"
              placeholder="AZ-1234"
              type="search"
              required
              @change="
                (e: Event) =>
                  (tokenSearch = (e.target as HTMLInputElement).value)
              "
            />
            <FormInput
              :model-value="yearSearch"
              name="year"
              label="Created Year"
              placeholder="2024"
              type="number"
              required
              @change="
                (e: Event) =>
                  (yearSearch = (e.target as HTMLInputElement).value)
              "
            />
            <FormInput
              :model-value="generalSearch"
              class="min-w-96"
              name="general"
              label="General Search"
              placeholder="Search for anything in the unencrypted data"
              type="text"
              required
              @change="
                (e: Event) =>
                  (generalSearch = (e.target as HTMLInputElement).value)
              "
            />
            <div class="flex items-center">
              <ButtonNormal kind="action" class="" @click="resetSearch">
                <XMarkIcon class="w-6 h-6" />
                <span>Reset Search</span>
              </ButtonNormal>
            </div>
          </div>
          <RecordsTableV3
            :records="records"
            :columns="view.columns"
            @click="generalSearch = $event"
          >
            <template #head-action>
              <RecordsCreateRecordV2 :query="queryRecords" />
            </template>
            <template #action="{ record }">
              <div class="flex items-center justify-end space-x-3">
                <CreateAccessRequest
                  v-if="!record.has_access"
                  :record-uuid="record.uuid"
                  :query="queryInfos"
                />
                <CreateDeletion
                  :record-uuid="record.uuid"
                  :query="queryInfos"
                />
              </div>
            </template>
          </RecordsTableV3>
          <PaginationBar
            :total="total"
            :set-query-param="setQueryParam"
            :query-params="queryParams"
          />
          <div
            class="px-5 py-2 mt-10 text-orange-700 bg-orange-100 border-2 border-orange-300"
          >
            <p>
              Info: We're currently updating this view. Everything you see
              should work. But if you face any issues, like not being able to
              find some records, please let us know. Speed and search
              improvements will follow.
              <br />
              E-Mail:
              <a href="mailto:it@law-orga.de" class="underline">
                it@law-orga.de
              </a>
            </p>
          </div>
        </template>
        <template #settings>
          <SettingsViews :query="query" :views="views" />
        </template>
        <template #deletions>
          <DeletionRequests
            :query="queryInfos"
            :deletion-requests="deletionRequests"
          />
        </template>
        <template #accessRequests>
          <AccessRequests
            :query="queryInfos"
            :access-requests="accessRequests"
          />
        </template>
        <template #recordPermissions>
          <RecordsPermissionsTable />
        </template>
      </TabControls>
    </div>
  </BoxLoader>
</template>
