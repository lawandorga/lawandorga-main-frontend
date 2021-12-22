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
        v-for="{
          helptext,
          name,
          label,
          type,
          disabled,
          required,
          placeholder,
          autocomplete,
          options,
        } in fields"
        :key="name"
        :class="{ hidden: type === 'hidden' }"
      >
        <FormTextarea
          v-if="type === 'textarea'"
          v-bind="getAttrs(name)"
          :label="label"
          :name="name"
          :type="type"
          :required="required"
          :placeholder="placeholder"
          @change="update(name, $event)"
        />
        <FormSelect
          v-else-if="type === 'select'"
          v-bind="getAttrs(name)"
          :label="label"
          :name="name"
          :required="required"
          :options="options ?? []"
          @update:model-value="update(name, $event)"
        />
        <FormMultiple
          v-else-if="type === 'multiple'"
          v-bind="getAttrs(name)"
          :label="label"
          :name="name"
          :required="required"
          :options="options ?? []"
          @update:model-value="update(name, $event)"
        />
        <FormInput
          v-else
          v-bind="getAttrs(name)"
          :label="label"
          :autocomplete="autocomplete"
          :name="name"
          :disabled="disabled"
          :type="type"
          :required="required"
          :placeholder="placeholder"
          :helptext="helptext"
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
import { FormField } from "@/types/form";
import { defineComponent, PropType } from "vue";
import { DjangoError, JsonModel } from "@/types/shared";
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
    fields: {
      type: Array as PropType<FormField[]>,
      required: true,
    },
    entries: {
      type: Object as PropType<{ [key: string]: RecordEntry }>,
      default: null,
      required: false,
    },
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
  watch: {
    entries: function (newValue) {
      this.entriesCopy = JSON.parse(JSON.stringify(newValue));
      //       this.fields.forEach((f) => {
      //         if (!(f.name in this.entriesCopy)) this.entriesCopy[f.name] = {
      //               id: number;
      //   name: string;
      //   order: number;
      //   value: RecordValue;
      //   field: number;
      //   field_type: string;
      //   url: string;
      //         };
      //       });
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
    // handleSubmit() {
    //   this.showSuccess = false;
    //   this.loading = true;
    //   if (this.action) this.dispatchStore(this.data);
    //   else this.sendRequest(this.data);
    // },
    // sendRequest(requestData: JsonModel | FormData) {
    //   if (this.fields.map((item) => item.type).includes("file")) {
    //     requestData = new FormData(this.$refs.form as HTMLFormElement);
    //     if (this.initial)
    //       Object.keys(this.initial).forEach((key) => {
    //         if (!(key in requestData))
    //           (requestData as FormData).set(key, this.initial[key] as string);
    //       });
    //   }
    //   this.request(requestData)
    //     .then((data: JsonModel) => this.handleSuccess(data))
    //     .catch((error: AxiosError<DjangoError>) =>
    //       this.handleError(error.response ? error.response.data : {}),
    //     );
    // },
    // dispatchStore(data: JsonModel) {
    //   this.$store
    //     .dispatch(this.action, data)
    //     .then((data: JsonModel) => this.handleSuccess(data))
    //     .catch((error: AxiosError<DjangoError>) =>
    //       this.handleError(error.response ? error.response.data : {}),
    //     );
    // },
    // handleSuccess(data: JsonModel) {
    //   this.errors = {};
    //   this.nonFieldErrors = [];
    //   if (this.initial === null) this.data = {};
    //   this.showSuccess = true;
    //   this.loading = false;
    //   this.$emit("success", data);
    // },
    // handleError(errors: DjangoError) {
    //   this.errors = errors;
    //   this.nonFieldErrors = errors.non_field_errors as string[];
    //   this.loading = false;
    //   this.$emit("error", errors);
    // },
  },
});
</script>
