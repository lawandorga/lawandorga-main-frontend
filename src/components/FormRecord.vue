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
        v-for="{ name, label, type, options } in fields"
        :key="name"
        :class="{ hidden: type === 'hidden' }"
      >
        <FormTextarea
          v-if="type === 'textarea'"
          v-bind="getAttrs(name)"
          :label="label"
          :name="name"
          :type="type"
          required
          @change="update(name, $event)"
        />
        <FormSelect
          v-else-if="type === 'select'"
          v-bind="getAttrs(name)"
          :label="label"
          :name="name"
          required
          :options="options ?? []"
          @update:model-value="update(name, $event)"
        />
        <FormMultiple
          v-else-if="type === 'multiple'"
          v-bind="getAttrs(name)"
          :label="label"
          :name="name"
          required
          :options="options ?? []"
          @update:model-value="update(name, $event)"
        />
        <FormInput
          v-else
          v-bind="getAttrs(name)"
          :label="label"
          :name="name"
          :type="type"
          required
          @change="update(name, $event)"
        />
        <p
          v-if="errors[name]"
          class="text-red-700 text-sm leading-tight ml-1.5 mt-1"
        >
          {{ errors[name][0] }}
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

export default defineComponent({
  components: {
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
      entriesCopy: {} as { [key: string]: RecordEntry },
      nonFieldErrors: [] as string[],
      errors: {} as DjangoError,
    };
  },
  computed: {
    fields() {
      return this.record.fields;
    },
    entries() {
      return this.record.entries;
    },
  },
  methods: {
    getAttrs(name: string) {
      if (name in this.entries)
        return { "model-value": this.entries[name].value };
      return {};
    },
    update(field: RecordField, value: RecordEntry["value"]) {
      if (field.name in this.entries) {
        const data = {
          url: this.entries[field.name].url,
          value: value,
        };
        RecordsService.updateEntry(data).catch((e: AxiosError) => {
          if (e.response) this.handleError(field, e.response.data);
        });
      } else {
        const data = {
          value: value,
          field: field.id,
          record: this.record.id,
        };
        RecordsService.createEntry(data).catch((e: AxiosError) => {
          if (e.response) this.handleError(field, e.response.data);
        });
      }
    },
    handleError(field: RecordField, errors: DjangoError) {
      this.errors[field.name] = errors["value"];
      this.nonFieldErrors = errors.non_field_errors as string[];
    },
  },
});
</script>
