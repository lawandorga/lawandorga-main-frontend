<template>
  <form ref="form" @submit.prevent="handleSubmit">
    <div class="grid grid-cols-1 gap-4">
      <div v-if="nonFieldErrors && nonFieldErrors.length">
        <p
          v-for="(error, index) in nonFieldErrors"
          :key="index"
          class="text-red-700 text-sm leading-tight mt-2"
        >
          {{ error }}
        </p>
      </div>
      <div
        v-for="field in fields"
        :key="field.name"
        :class="{ hidden: field.type === 'hidden' }"
      >
        <FormTextarea
          v-if="field.type === 'textarea'"
          v-bind="getAttrs(field.name)"
          :label="field.label"
          :name="field.name"
          required
          @change="change(field, $event.target.value)"
        />
        <FormSelect
          v-else-if="field.type === 'select'"
          v-bind="getAttrs(field.name)"
          :label="field.label"
          :name="field.name"
          required
          :options="field.options ?? []"
          @update:model-value="change(field, $event)"
        />
        <FormMultiple
          v-else-if="field.type === 'multiple'"
          v-bind="getAttrs(field.name)"
          :label="field.label"
          :name="field.name"
          required
          :options="field.options ?? []"
          @update:model-value="change(field, $event)"
        />
        <FormFile
          v-else-if="field.type === 'file'"
          v-bind="getAttrs(field.name)"
          :label="field.label"
          :name="field.name"
          required
          @update:model-value="change(field, $event)"
          @download="downloadFile(field.name)"
        />
        <FormInput
          v-else
          v-bind="getAttrs(field.name)"
          :label="field.label"
          :name="field.name"
          :type="field.type"
          required
          @focusout="change(field, $event.target.value)"
        />
        <p
          v-if="errors[field.name]"
          class="text-red-700 text-sm leading-tight ml-1.5 mt-1"
        >
          {{ errors[field.name][0] }}
        </p>
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import FormInput from "./FormInput.vue";
import FormTextarea from "./FormTextarea.vue";
import FormSelect from "./FormSelect.vue";
import { defineComponent, PropType } from "vue";
import { DjangoError } from "@/types/shared";
import { AxiosError } from "axios";
import FormMultiple from "./FormMultiple.vue";
import { RecordEntry, Record, RecordField } from "@/types/records";
import RecordsService from "@/services/records";
import FormFile from "@/components/FormFile.vue";

export default defineComponent({
  components: {
    FormFile,
    FormSelect,
    FormInput,
    FormTextarea,
    FormMultiple,
  },
  props: {
    record: {
      type: Object as PropType<Record>,
      required: true,
    },
  },
  data() {
    return {
      entries: {} as Record["entries"],
      nonFieldErrors: [] as string[],
      errors: {} as DjangoError,
    };
  },
  computed: {
    fields() {
      return this.record.fields;
    },
  },
  watch: {
    record(newValue) {
      this.entries = newValue.entries;
    },
  },
  created() {
    this.entries = this.record.entries;
  },
  methods: {
    downloadFile(name: string) {
      const entry = this.entries[name];
      RecordsService.downloadFileFromEntry(entry);
    },
    getAttrs(name: string) {
      if (name in this.entries)
        return { "model-value": this.entries[name].value };
      return {};
    },
    change(field: RecordField, value: RecordEntry["value"]) {
      this.errors = {};
      if (Object.keys(this.entries).includes(field.name)) {
        if (value) this.updateEntry(field, value);
        else this.deleteEntry(field);
      } else if (value) {
        this.createEntry(field, value);
      }
    },
    createEntry(field: RecordField, value: RecordEntry["value"]) {
      if (field.type === "file") {
        const formData = new FormData();
        formData.append("file", this.getFilesFromInput(field.name));
        formData.append("field", field.id.toString());
        formData.append("record", this.record.id.toString());
        formData.append("url", field.entry_url);
        RecordsService.createFileEntry(formData)
          .then((entry) => this.handleSuccess(field, entry))
          .catch((e: AxiosError) => {
            if (e.response) this.handleError(field, e.response.data);
          });
      } else {
        const data = {
          value: value,
          field: field.id,
          record: this.record.id,
          url: field.entry_url,
        };
        RecordsService.createEntry(data)
          .then((entry) => this.handleSuccess(field, entry))
          .catch((e: AxiosError) => {
            if (e.response) this.handleError(field, e.response.data);
          });
      }
    },
    updateEntry(field: RecordField, value: RecordEntry["value"]) {
      const data = {
        url: this.entries[field.name].url,
        value: value,
      };
      RecordsService.updateEntry(data)
        .then((entry) => this.handleSuccess(field, entry))
        .catch((e: AxiosError) => {
          if (e.response) this.handleError(field, e.response.data);
        });
    },
    deleteEntry(field: RecordField) {
      const url = this.entries[field.name].url;
      RecordsService.deleteEntry(url)
        .then(() => {
          delete this.entries[field.name];
        })
        .catch((e: AxiosError) => {
          if (e.response) this.handleError(field, e.response.data);
        });
    },
    handleSuccess(field: RecordField, entry: RecordEntry) {
      this.entries[field.name] = entry;
    },
    handleError(field: RecordField, errors: DjangoError) {
      this.errors[field.name] =
        errors["value"] || errors["file"] || errors["non_field_errors"];
    },
    getFilesFromInput(name: string): string | File {
      const field = (this.$refs["form"] as HTMLFormElement).querySelector(
        `input[name='${name}']`,
      ) as HTMLInputElement;
      if (!field.files) return "";
      return field.files[0];
    },
  },
});
</script>
