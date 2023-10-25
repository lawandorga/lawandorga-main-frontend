<template>
  <form ref="form" novalidate @submit.prevent="">
    <div class="grid grid-cols-1 gap-4">
      <div v-if="nonFieldErrors && nonFieldErrors.length">
        <p
          v-for="(error, index) in nonFieldErrors"
          :key="index"
          class="mt-2 text-sm leading-tight text-red-700"
        >
          {{ error }}
        </p>
      </div>
      <div
        v-for="field in fields"
        :key="field.name"
        :class="{
          hidden: field.type === 'hidden',
          'border-green-500 border px-2 pb-2 pt-2 rounded bg-gradient-to-t from-green-100 to-transparent print:hidden':
            field.kind === 'Statistic',
        }"
      >
        <FormTextarea
          v-if="field.type === 'textarea'"
          v-bind="getAttrs(field.name)"
          :label="field.label"
          :name="field.name"
          required
          @change:model-value="change(field, $event)"
        />
        <FormSelect
          v-else-if="field.type === 'select'"
          v-bind="getAttrs(field.name)"
          :label="field.label"
          :name="field.name"
          required
          :options="field.options"
          @update:model-value="change(field, $event)"
        />
        <FormMultiple
          v-else-if="field.type === 'multiple'"
          v-bind="getAttrs(field.name)"
          :label="field.label"
          :name="field.name"
          required
          :options="field.options"
          @update:model-value="change(field, $event)"
        />
        <FormFile
          v-else-if="field.type === 'file'"
          v-bind="getAttrs(field.name)"
          :label="field.label"
          :name="field.name"
          required
          @update:model-value="change(field, $event)"
        >
          <ButtonNormal
            v-if="field.name in entries"
            kind="action"
            class="font-medium text-gray-700 rounded hover:text-opacity-75 focus:outline-none"
            @click="downloadFile(field.name)"
          >
            Download
          </ButtonNormal>
          <ButtonNormal
            v-if="field.name in entries"
            kind="delete"
            class="font-medium text-gray-700 rounded hover:text-opacity-75 focus:outline-none"
            @click="change(field, '')"
          >
            Delete
          </ButtonNormal>
        </FormFile>
        <FormInput
          v-else
          :name="field.name"
          v-bind="getAttrs(field.name)"
          :label="field.label"
          :type="field.type"
          required
          @change:model-value="change(field, $event)"
        />
        <p
          v-if="errors[field.name]"
          class="text-red-700 text-sm leading-tight ml-1.5 mt-1"
        >
          {{ errors[field.name][0] }}
        </p>
      </div>
      <div class="text-sm text-green-800 print:hidden">
        Green fields are statistic fields that are used by Law&Orga internally
        to help us and you. It is in no way required to fill out these fields.
        But it would help us a lot.
      </div>
    </div>
  </form>
</template>

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
import { DjangoError } from "@/types/shared";
import { AxiosError } from "axios";
import { RecordEntry, Record, RecordField } from "@/types/records";
import { useErrorHandling } from "@/api/errors";
import useCmd from "@/composables/useCmd";
import useClient from "@/api/client";

const props = defineProps<{ record: Record; query: () => void }>();
const { record, query } = toRefs(props);

const entries = ref<Record["entries"]>({});
const nonFieldErrors = ref<string[]>([]);
const errors = ref<DjangoError>({});

const fields = computed(() => {
  return record.value.fields;
});

watch(record, (newValue) => {
  entries.value = newValue.entries;
});

entries.value = record.value.entries;

const client = useClient();
function downloadFile(name: string) {
  const entry = entries.value[name];
  const downloadRequest = client.downloadFile(
    `api/data_sheets/query/file_entry_download/${entry.id}/`,
  );
  downloadRequest({ filename: entry.value as string });
}

function getAttrs(name: string) {
  if (name in entries.value)
    return { "model-value": entries.value[name].value };
  return {};
}

function change(field: RecordField, value: RecordEntry["value"]) {
  errors.value = {};
  const entries_include = Object.keys(entries.value).includes(field.name);
  if (entries_include && value) {
    updateEntry(field, value);
  } else if (entries_include && !value) {
    deleteEntry(field);
  } else if (!entries_include && value) {
    createEntry(field, value);
  }
}

const { commandRequest } = useCmd(query);

function createFileEntry(field: RecordField, value: RecordEntry["value"]) {
  const formData = new FormData();
  formData.append("field_id", field.uuid);
  formData.append("record_id", record.value.id.toString());
  formData.append("file", value as File);
  formData.append("action", "data_sheets/create_file_entry");
  commandRequest(formData).catch((e) => handleError(field, e));
}

function createEntry(field: RecordField, value: RecordEntry["value"]) {
  if (field.type === "file") {
    createFileEntry(field, value);
    return;
  }
  const data = {
    field_id: field.uuid,
    record_id: record.value.id,
    value: value,
    action: "data_sheets/create_entry",
  };
  commandRequest(data).catch((e) => handleError(field, e));
}

function updateEntry(field: RecordField, value: RecordEntry["value"]) {
  const data = {
    field_id: field.uuid,
    record_id: record.value.id,
    value: value,
    action: "data_sheets/update_entry",
  };
  commandRequest(data).catch((e) => handleError(field, e));
}

function deleteEntry(field: RecordField) {
  const data = {
    field_id: field.uuid,
    record_id: record.value.id,
    action: "data_sheets/delete_entry",
  };
  commandRequest(data).catch((e) => handleError(field, e));
}

const { handleCommandError } = useErrorHandling();

function handleError(field: RecordField, e: AxiosError) {
  return handleCommandError(e).catch((error: types.ICommandError) => {
    if (error.paramErrors.value) {
      errors.value[field.name] = error.paramErrors.value as string[];
    } else if (error.generalErrors)
      errors.value[field.name] = error.generalErrors;
    else if (error.title) errors.value[field.name] = error.title;
    else return Promise.reject(error);
    return Promise.resolve();
  });
}
</script>
