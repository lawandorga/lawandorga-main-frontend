<template>
  <BoxLoader :show="userStore.loaded">
    <div class="mx-auto space-y-6 max-w-screen-2xl">
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
      <TableRecords :records="records">
        <template #head-action>
          <ButtonNormal kind="action" @click="createModalOpen = true">
            Create Record
          </ButtonNormal>
        </template>
        <template #action="slotProps">
          <ButtonNormal
            v-if="!slotProps.record.access"
            size="xs"
            kind="action"
            @click="
              record = slotProps.record;
              createRecordAccessModalOpen = true;
            "
          >
            Request Access
          </ButtonNormal>
          <ButtonNormal
            size="xs"
            kind="delete"
            :disabled="slotProps.record.delete"
            @click="
              record = slotProps.record;
              createDeletionRequestModalOpen = true;
            "
          >
            Request Deletion
          </ButtonNormal>
        </template>
      </TableRecords>
    </div>
    <!-- modals -->
    <ModalFree v-model="createModalOpen" title="Create Record">
      <FormGenerator
        :fields="createFields"
        :request="createRequest"
        @success="recordCreated($event)"
      ></FormGenerator>
    </ModalFree>
    <ModalFree
      v-model="createDeletionRequestModalOpen"
      title="Request Deletion"
    >
      <FormGenerator
        :fields="[
          {
            label: 'Explanation',
            name: 'explanation',
            type: 'textarea',
            required: true,
          },
        ]"
        :initial="{
          record: record ? record.id : null,
        }"
        :request="createDeletionRequestRequest"
        submit="Request Deletion"
        @success="deletionRequestCreated"
      ></FormGenerator>
    </ModalFree>
    <ModalFree v-model="createRecordAccessModalOpen" title="Request Access">
      <FormGenerator
        :fields="[
          {
            label: 'Explanation',
            name: 'explanation',
            type: 'textarea',
            required: false,
          },
        ]"
        :initial="{
          record: record ? record.id : null,
          requested_by: userStore.user?.user_id,
        }"
        :request="createRecordAccessRequest"
        submit="Request Access"
      ></FormGenerator>
    </ModalFree>
  </BoxLoader>
</template>

<script lang="ts">
import TableRecords from "@/components/TableRecords.vue";
import BoxLoader from "@/components/BoxLoader.vue";
import { defineComponent, ref, Ref, watch } from "vue";
import RecordsService from "@/services/records";
import { RecordDeletion, RecordTemplate, Record } from "@/types/records";
import { ButtonNormal } from "@lawandorga/components";
import { ModalFree } from "@lawandorga/components";
import { FormGenerator } from "@lawandorga/components";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { RectangleStackIcon } from "@heroicons/vue/24/outline";
import ButtonBreadcrumbs from "@/components/ButtonBreadcrumbs.vue";
import { formatDate } from "@/utils/date";
import useCreate from "@/composables/useCreate";
import useGet from "@/composables/useGet";
import { useRouter } from "vue-router";
import RecordsPermissions from "@/components/RecordsPermissions.vue";
import { FormField } from "@/types/form";
import { useUserStore } from "@/store/user";

export default defineComponent({
  components: {
    RecordsPermissions,
    ButtonBreadcrumbs,
    RectangleStackIcon,
    BreadcrumbsBar,
    FormGenerator,
    BoxLoader,
    TableRecords,
    ButtonNormal,
    ModalFree,
  },
  setup() {
    // records
    const records = ref(null) as Ref<Record[] | null>;
    const record = ref(null) as Ref<Record | null>;
    useGet(RecordsService.getRecords, records);

    const userStore = useUserStore();

    return {
      // store
      userStore,
      // utils
      formatDate,
      // records
      records,
      record,
      // access
      ...createRecordAccess(),
      ...createRecord(records),
      ...createDeletionRequest(records),
    };
  },
});

function createRecordAccess() {
  const {
    createRequest: createRecordAccessRequest,
    createModalOpen: createRecordAccessModalOpen,
  } = useCreate(RecordsService.createRecordAccess, ref(null));

  return {
    createRecordAccessRequest,
    createRecordAccessModalOpen,
  };
}

function createDeletionRequest(records: Ref<Record[] | null>) {
  const {
    createRequest: createDeletionRequestRequest,
    createModalOpen: createDeletionRequestModalOpen,
  } = useCreate(RecordsService.createDeletionRequest, ref(null));

  const deletionRequestCreated = (deletionRequest: RecordDeletion) => {
    if (records.value === null) return;
    const index = records.value.findIndex(
      (item) => item.id === deletionRequest.record,
    );
    if (index !== -1) records.value[index].delete = true;
  };

  return {
    createDeletionRequestRequest,
    createDeletionRequestModalOpen,
    deletionRequestCreated,
  };
}

function createRecord(records: Ref<Record[] | null>) {
  const router = useRouter();

  const createFields = ref<FormField[]>([
    {
      label: "Template",
      type: "select",
      name: "template",
      required: true,
      options: [] as RecordTemplate[],
    },
  ]);

  const { createRequest, createModalOpen } = useCreate(
    RecordsService.createRecord,
    records,
  );

  const recordCreated = (record: Record) => {
    router.push({ name: "records-detail", params: { id: record.id } });
  };

  watch(createModalOpen, () => {
    RecordsService.getTemplates().then(
      (templates) => (createFields.value[0].options = templates),
    );
  });

  return {
    createFields,
    createRequest,
    createModalOpen,
    recordCreated,
  };
}
</script>
