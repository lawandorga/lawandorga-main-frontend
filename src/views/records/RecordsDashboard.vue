<template>
  <BoxLoader
    :show="
      userStore.loaded &&
      !!actionsRecordDeletions &&
      !!actionsRecordAccesses &&
      !!actionsRecords
    "
  >
    <div
      v-if="
        userStore.loaded &&
        !!actionsRecordDeletions &&
        !!actionsRecordAccesses &&
        !!actionsRecords
      "
      class="mx-auto space-y-6 max-w-screen-2xl"
    >
      <BreadcrumbsBar :base="{ name: 'records-dashboard' }" :pages="[]">
        <RectangleStackIcon class="w-6 h-6" />
        <template #buttons>
          <RecordsPermissions />
          <ButtonBreadcrumbs
            v-if="userStore.rlc?.use_record_pool"
            :to="{ name: 'records-pool' }"
          >
            Go to the Record Pool
          </ButtonBreadcrumbs>
        </template>
      </BreadcrumbsBar>
      <TableRecords :records="records" :columns="page?.columns">
        <template #head-action>
          <ButtonNormal
            kind="action"
            @click="actionsRecords.createModalOpen = true"
          >
            Create Record
          </ButtonNormal>
        </template>
        <template #action="slotProps">
          <ButtonNormal
            v-if="!slotProps.record.has_access"
            size="xs"
            kind="action"
            @click="
              actionsRecordAccesses.temporary = slotProps.record;
              actionsRecordAccesses.createRecordAccessModalOpen = true;
            "
          >
            Request Access
          </ButtonNormal>
          <ButtonNormal
            v-if="!slotProps.record.delete_requested"
            size="xs"
            kind="delete"
            @click="
              actionsRecordDeletions.temporary = slotProps.record;
              actionsRecordDeletions.createDeletionRequestModalOpen = true;
            "
          >
            Request Deletion
          </ButtonNormal>
        </template>
      </TableRecords>
    </div>
  </BoxLoader>
  <ActionsRecordAccesses ref="actionsRecordAccesses" :query="query" />
  <ActionsRecordDeletions ref="actionsRecordDeletions" :query="query" />
  <ActionsRecords ref="actionsRecords" :query="query" />
</template>

<script lang="ts" setup>
import TableRecords from "@/components/TableRecords.vue";
import BoxLoader from "@/components/BoxLoader.vue";
import { computed, ref } from "vue";
import { recordsGetPage } from "@/services/records";
import { IListRecord, IRecordListPage } from "@/types/records";
import { ButtonNormal } from "@lawandorga/components";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { RectangleStackIcon } from "@heroicons/vue/24/outline";
import ButtonBreadcrumbs from "@/components/ButtonBreadcrumbs.vue";
import useGet from "@/composables/useGet";
import RecordsPermissions from "@/components/RecordsPermissions.vue";
import { useUserStore } from "@/store/user";
import ActionsRecordDeletions from "@/components/ActionsRecordDeletions.vue";
import ActionsRecordAccesses from "@/components/ActionsRecordAccesses.vue";
import ActionsRecords from "@/components/ActionsRecords.vue";

// page
const page = ref<IRecordListPage | null>(null);
const query = useGet(recordsGetPage, page);

// actions
const actionsRecordDeletions = ref<typeof ActionsRecordDeletions>();
const actionsRecordAccesses = ref<typeof ActionsRecordAccesses>();
const actionsRecords = ref<typeof ActionsRecords>();

// records
const records = computed<IListRecord[] | null>(() => {
  if (page.value === null) return null;
  return page.value.records;
});

// store
const userStore = useUserStore();
</script>
