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
          v-bind="getAttrs(field.uuid)"
          :label="field.label"
          :name="field.name"
          required
          @change:model-value="change(field, $event)"
        />
        <FormSelect
          v-else-if="field.type === 'select'"
          v-bind="getAttrs(field.uuid)"
          :label="field.label"
          :name="field.name"
          required
          :options="field.options"
          @update:model-value="change(field, $event)"
        />
        <FormMultiple
          v-else-if="field.type === 'multiple'"
          v-bind="getAttrs(field.uuid)"
          :label="field.label"
          :name="field.name"
          required
          :options="field.options"
          @update:model-value="change(field, $event)"
        />
        <FormFile
          v-else-if="field.type === 'file'"
          v-bind="getAttrs(field.uuid)"
          :label="field.label"
          :name="field.name"
          required
          @update:model-value="change(field, $event)"
        >
          <ButtonNormal
            v-if="field.uuid in entries"
            kind="action"
            class="font-medium text-gray-700 rounded hover:text-opacity-75 focus:outline-none"
            @click="downloadFile(field.uuid)"
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
          v-bind="getAttrs(field.uuid)"
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
import { Record, RecordField, RecordValue } from "@/types/records";
import { useErrorHandling } from "@/api/errors";
import useCmd from "@/composables/useCmd";
import useClient from "@/api/client";

const props = defineProps<{ record: Record; query: () => void }>();
const { record } = toRefs(props);

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

function change(field: RecordField, value: RecordValue) {
  errors.value = {};
  const entries_include = Object.keys(entries.value).includes(field.uuid);
  if (field.type === "file") {
    createFileEntry(field, value);
  } else if (entries_include && !value) {
    deleteEntry(field);
  } else {
    createOrUpdateEntry(field, value);
  }
}

const { commandRequest } = useCmd();

function createFileEntry(field: RecordField, value: RecordValue) {
  const formData = new FormData();
  formData.append("field_id", field.uuid);
  formData.append("record_id", record.value.id.toString());
  formData.append("file", value as File);
  formData.append("action", "data_sheets/create_file_entry");
  commandRequest(formData).catch((e) => handleError(field, e));
  record.value.entries[field.uuid] = (value as File).name;
}

function createOrUpdateEntry(field: RecordField, value: RecordValue) {
  const data = {
    field_id: field.uuid,
    record_id: record.value.id,
    value: value,
    action: "data_sheets/create_or_update_entry",
  };
  commandRequest(data).catch((e) => handleError(field, e));
  record.value.entries[field.uuid] = value;
}

function deleteEntry(field: RecordField) {
  const data = {
    field_id: field.uuid,
    record_id: record.value.id,
    action: "data_sheets/delete_entry",
  };
  commandRequest(data).catch((e) => handleError(field, e));
  delete record.value.entries[field.uuid];
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
