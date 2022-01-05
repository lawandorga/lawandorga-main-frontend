<template>
  <BoxLoader :show="$store.getters['user/loaded']">
    <div class="max-w-screen-2xl mx-auto space-y-6">
      <BreadcrumbsBar :base="{ name: 'records-dashboard' }" :pages="[]">
        <CollectionIcon class="w-6 h-6" />
        <template #buttons>
          <ButtonBreadcrumbs @click="generalPermissionsModalOpen = true">
            Show General Permissions
          </ButtonBreadcrumbs>
          <ButtonBreadcrumbs
            v-if="$store.getters['user/rlc'].use_record_pool"
            :to="{ name: 'records-pool' }"
          >
            Go to the Record Pool
          </ButtonBreadcrumbs>
        </template>
      </BreadcrumbsBar>
      <TableRecords :records="records">
        <template #head-action>
          <div class="flex justify-end">
            <ButtonTable type="button" @click="createModalOpen = true">
              Create Record
            </ButtonTable>
          </div>
        </template>
        <template #action="slotProps">
          <div class="flex justify-end space-x-3">
            <ButtonTable
              v-if="!slotProps.record.access"
              type="button"
              @click="requestAccess(slotProps.record)"
            >
              Request Access
            </ButtonTable>
            <ButtonTable
              type="button"
              :disabled="slotProps.record.delete"
              @click="
                record = slotProps.record;
                createDeletionRequestModalOpen = true;
              "
            >
              Request Deletion
            </ButtonTable>
          </div>
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
          requested_by: $store.getters['user/user'].id,
        }"
        :request="createDeletionRequestRequest"
        submit="Request Deletion"
        @success="deletionRequestCreated"
      ></FormGenerator>
    </ModalFree>
    <!-- breadcrumbs -->
    <ModalFree
      v-model="generalPermissionsModalOpen"
      width="max-w-screen-xl"
      title="General Permission"
    >
      <p class="mb-10 text-gray-600">
        Groups or users listed here have permissions that apply to the whole
        collab section. Those permissions can be managed within the admin
        section.
      </p>
      <TableGenerator
        :head="[
          { name: 'User', key: ['user_has_permission', 'name'] },
          { name: 'Group', key: ['group_has_permission', 'name'] },
          { name: 'Permission', key: ['permission', 'name'] },
        ]"
        :data="generalPermissions"
      ></TableGenerator>
    </ModalFree>
  </BoxLoader>
</template>

<script lang="ts">
import TableRecords from "@/components/TableRecords.vue";
import TableGenerator from "@/components/TableGenerator.vue";
import BoxLoader from "@/components/BoxLoader.vue";
import { defineComponent, ref, Ref, reactive, watch } from "vue";
import RecordsService from "@/services/records";
import { RecordDeletion, RecordTemplate, Record } from "@/types/records";
import ButtonTable from "@/components/ButtonTable.vue";
import ModalFree from "@/components/ModalFree.vue";
import FormGenerator from "@/components/FormGenerator.vue";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { CollectionIcon } from "@heroicons/vue/outline";
import ButtonBreadcrumbs from "@/components/ButtonBreadcrumbs.vue";
import { HasPermission } from "@/types/core";
import { formatDate } from "@/utils/date";
import useCreateItem from "@/composables/useCreateItem";
import useGetItems from "@/composables/useGetItems";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default defineComponent({
  components: {
    ButtonBreadcrumbs,
    CollectionIcon,
    BreadcrumbsBar,
    FormGenerator,
    BoxLoader,
    TableGenerator,
    TableRecords,
    ButtonTable,
    ModalFree,
  },
  setup() {
    // store
    const store = useStore();

    // records
    const records = ref(null) as Ref<Record[] | null>;
    const record = ref(null) as Ref<Record | null>;
    useGetItems(RecordsService.getRecords, records);

    // general
    const generalPermissions = ref(null) as Ref<HasPermission[] | null>;
    const generalPermissionsModalOpen = ref(false);
    useGetItems(RecordsService.getGeneralPermissions, generalPermissions);

    // request access
    const requestAccess = (record: Record) => {
      RecordsService.requestAccess(record).then(() =>
        store.dispatch("alert/createAlert", {
          heading: "Access Requested",
          type: "success",
          message: "An admin needs to allow you to see this record now.",
        }),
      );
    };

    return {
      // utils
      formatDate,
      // records
      records,
      record,
      // general
      generalPermissions,
      generalPermissionsModalOpen,
      // access
      requestAccess,
      ...createRecord(records),
      ...createDeletionRequest(records),
    };
  },
});

function createDeletionRequest(records: Ref<Record[] | null>) {
  const {
    createRequest: createDeletionRequestRequest,
    createModalOpen: createDeletionRequestModalOpen,
  } = useCreateItem(RecordsService.createDeletionRequest, ref(null));
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

  const createFields = reactive([
    {
      label: "Template",
      type: "select",
      name: "template",
      required: true,
      options: [] as RecordTemplate[],
    },
  ]);

  const { createRequest, createModalOpen } = useCreateItem(
    RecordsService.createRecord,
    records,
  );

  const recordCreated = (record: Record) => {
    router.push({ name: "records-detail", params: { id: record.id } });
  };

  watch(createModalOpen, () => {
    RecordsService.getTemplates().then(
      (templates) => (createFields[0].options = templates),
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
