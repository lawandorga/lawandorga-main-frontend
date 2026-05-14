<script lang="ts" setup>
import {
  FormSelect,
  FormMultiple,
  FormTextarea,
  FormInput,
  FormFile,
  ButtonNormal,
  types,
} from "lorga-ui";
import { computed, ref, toRefs, watch } from "vue";

import useClient from "@/api/client";
import useCmd from "@/composables/useCmd";

import { Sheet, SheetField, SheetValue } from "../api/useDataSheet";

const props = defineProps<{ record: Sheet; query: () => void }>();
const { record } = toRefs(props);

const entries = ref<Sheet["entries"]>({});
const errors = ref<{ [key: string]: string[] }>({});

const fields = computed(() => {
  return record.value.fields;
});

watch(record, (newValue) => {
  entries.value = newValue.entries;
});

entries.value = record.value.entries;

const client = useClient();
function downloadFile(uuid: string) {
  const value = entries.value[uuid];
  const downloadRequest = client.downloadFile(
    `api/data_sheets/query/file_entry_download/${record.value.id}/${uuid}/`,
  );
  downloadRequest({ filename: value as string });
}

function getAttrs(uuid: string) {
  if (uuid in entries.value) return { "model-value": entries.value[uuid] };
  return {};
}

function change(field: SheetField, value: SheetValue) {
  errors.value = {};
  const entryExists = Object.keys(entries.value).includes(field.uuid);
  if (field.type === "file") {
    createFileEntry(field, value);
  } else if (!value) {
    if (entryExists) deleteEntry(field);
  } else {
    createOrUpdateEntry(field, value);
  }
}

const { commandRequest } = useCmd();

function createFileEntry(field: SheetField, value: SheetValue) {
  const formData = new FormData();
  formData.append("field_id", field.uuid);
  formData.append("record_id", record.value.id.toString());
  formData.append("file", value as File);
  formData.append("action", "data_sheets/create_file_entry");
  commandRequest(formData).catch((error) => handleError(field, error));
  record.value.entries[field.uuid] = (value as File).name;
}

function createOrUpdateEntry(field: SheetField, value: SheetValue) {
  const data = {
    field_id: field.uuid,
    record_id: record.value.id,
    value: value,
    action: "data_sheets/create_or_update_entry",
  };
  commandRequest(data).catch((error) => handleError(field, error));
  record.value.entries[field.uuid] = value;
}

function deleteEntry(field: SheetField) {
  const data = {
    field_id: field.uuid,
    record_id: record.value.id,
    action: "data_sheets/delete_entry",
  };
  commandRequest(data).catch((error) => handleError(field, error));
  delete record.value.entries[field.uuid];
}

function handleError(field: SheetField, error: types.ICommandError) {
  if (error.paramErrors.value) {
    errors.value[field.name] = error.paramErrors.value as string[];
  } else if (error.generalErrors.length)
    errors.value[field.name] = error.generalErrors;
  else if (error.title) errors.value[field.name] = [error.title];
}
</script>

<template>
  <form novalidate @submit.prevent="">
    <div class="grid grid-cols-1 gap-4">
      <div
        v-for="field in fields"
        :key="field.name"
        :class="{
          hidden: field.type === 'hidden',
          'rounded border border-green-500 bg-linear-to-t from-green-100 to-transparent px-2 pt-2 pb-2 print:hidden':
            field.kind === 'Statistic',
        }"
      >
        <FormTextarea
          v-if="field.type === 'textarea'"
          v-bind="getAttrs(field.uuid)"
          :label="field.label"
          :name="field.name"
          :required="field.is_required"
          @change:model-value="change(field, $event)"
        />
        <FormSelect
          v-else-if="field.type === 'select'"
          v-bind="getAttrs(field.uuid)"
          :label="field.label"
          :name="field.name"
          :required="field.is_required"
          :options="field.options"
          @update:model-value="change(field, $event)"
        />
        <FormMultiple
          v-else-if="field.type === 'multiple'"
          v-bind="getAttrs(field.uuid)"
          :label="field.label"
          :name="field.name"
          :required="field.is_required"
          :options="field.options"
          @update:model-value="change(field, $event)"
        />

        <FormFile
          v-else-if="field.type === 'file'"
          v-bind="getAttrs(field.uuid)"
          :label="field.label"
          :name="field.name"
          :required="field.is_required"
          @update:model-value="change(field, $event)"
        >
          <ButtonNormal
            v-if="field.uuid in entries"
            kind="action"
            class="hover:text-opacity-75 rounded font-medium text-gray-700 focus:outline-none"
            @click="downloadFile(field.uuid)"
          >
            Download
          </ButtonNormal>
          <ButtonNormal
            v-if="field.uuid in entries"
            kind="delete"
            class="hover:text-opacity-75 rounded font-medium text-gray-700 focus:outline-none"
            @click="change(field, '')"
          >
            Delete
          </ButtonNormal>
        </FormFile>
        <FormInput
          v-else
          :name="field.name"
          v-bind="getAttrs(field.uuid)"
          :label="field.label"
          :type="field.type"
          :required="field.is_required"
          @change:model-value="change(field, $event)"
        />
        <p
          v-if="errors[field.name]"
          class="mt-1 ml-1.5 text-sm leading-tight text-red-700"
        >
          {{ errors[field.name][0] }}
        </p>
      </div>
      <div class="text-sm text-green-800 print:hidden">
        Green fields are statistic fields that will automatically show up in the
        Statistics Dashboard.
      </div>
    </div>
  </form>
</template>
