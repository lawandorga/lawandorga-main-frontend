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
      ></FormGenerator>
    </ModalFree>
    <ModalFree
      v-model="createDeletionRequestModalOpen"
      title="Request Deletion"
    >
      <FormGenerator
        :fields="[
          {
            label: 'Record',
            name: 'record_token',
            disabled: true,
            required: true,
          },
          {
            label: 'Explanation',
            name: 'explanation',
            type: 'textarea',
            required: true,
          },
        ]"
        :initial="{
          record_token: record ? record.record_token : null,
          record: record ? record.id : null,
          requested_from: $store.getters['user/user'].id,
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
import {
  Consultant,
  Country,
  RecordDeletionRequest,
  RestrictedRecord,
  Tag,
} from "@/types/records";
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
    const records = ref(null) as Ref<RestrictedRecord[] | null>;
    const record = ref(null) as Ref<RestrictedRecord | null>;
    useGetItems(RecordsService.getRecords, records);

    // general
    const generalPermissions = ref(null) as Ref<HasPermission[] | null>;
    const generalPermissionsModalOpen = ref(false);
    useGetItems(RecordsService.getGeneralPermissions, generalPermissions);

    // request access
    const requestAccess = (record: RestrictedRecord) => {
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

function createDeletionRequest(records: Ref<RestrictedRecord[] | null>) {
  const {
    createRequest: createDeletionRequestRequest,
    createModalOpen: createDeletionRequestModalOpen,
  } = useCreateItem(RecordsService.createDeletionRequest, ref(null));
  const deletionRequestCreated = (deletionRequest: RecordDeletionRequest) => {
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

function createRecord(records: Ref<RestrictedRecord[] | null>) {
  const createFields = reactive([
    {
      label: "Client",
      type: "text",
      name: "name",
      required: true,
    },
    {
      label: "Birthday",
      type: "date",
      name: "birthday",
      required: false,
    },
    {
      label: "Client Origin Country",
      type: "select",
      name: "origin_country",
      required: false,
      options: [] as Country[],
    },
    {
      label: "Client Phone",
      type: "tel",
      name: "phone_number",
      required: false,
    },
    {
      label: "Client Note",
      type: "text",
      name: "note",
      required: false,
    },
    {
      label: "Record Token",
      type: "text",
      name: "record_token",
      required: true,
    },
    {
      label: "Record Contact Date",
      type: "date",
      name: "first_contact_date",
    },
    {
      label: "Record Consultants",
      type: "multiple",
      name: "working_on_record",
      required: true,
      options: [] as Consultant[],
    },
    {
      label: "Tags",
      type: "multiple",
      name: "tags",
      required: true,
      options: [] as Tag[],
    },
    {
      label: "Record Note",
      type: "text",
      name: "record_note",
      required: false,
    },
  ]);

  const { createRequest, createModalOpen } = useCreateItem(
    RecordsService.createRecord,
    records,
  );

  watch(createModalOpen, () => {
    RecordsService.getCountries().then(
      (countries) => (createFields[2].options = countries),
    );
    RecordsService.getConsultants().then(
      (consultants) => (createFields[7].options = consultants),
    );
    RecordsService.getTags().then((tags) => (createFields[8].options = tags));
  });

  return {
    createFields,
    createRequest,
    createModalOpen,
  };
}
</script>
