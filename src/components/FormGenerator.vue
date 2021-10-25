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
          v-model="data[name]"
          :label="label"
          :name="name"
          :type="type"
          :required="required"
          :placeholder="placeholder"
          @update:modelValue="showSuccess = false"
        />
        <FormSelect
          v-else-if="type === 'select'"
          v-model="data[name]"
          :label="label"
          :name="name"
          :required="required"
          :options="options ?? []"
          @update:modelValue="showSuccess = false"
        />
        <FormTipTap v-else-if="type === 'tiptap'" v-model="data[name]" />
        <FormInput
          v-else
          v-model="data[name]"
          :label="label"
          :autocomplete="autocomplete"
          :name="name"
          :disabled="disabled"
          :type="type"
          :required="required"
          :placeholder="placeholder"
          @update:modelValue="showSuccess = false"
        />
        <p
          v-if="errors[name]"
          class="text-red-700 text-sm leading-tight ml-1.5 mt-1"
        >
          {{ errors[name][0] }}
        </p>
      </div>
      <div class="pt-2 flex items-center justify-end">
        <transition
          enter-active-class="transition duration-200 opacity-0"
          enter-class="opacity-0"
          enter-to-class="opacity-100"
          leave-class="opacity-100"
          leave-to-class="opacity-0"
          leave-active-class="transition duration-150"
          tag="div"
          class="mr-auto"
        >
          <p v-if="showSuccess" class="text-green-700">
            {{ success }}
          </p>
        </transition>
        <ButtonLight
          v-if="cancel"
          class="mr-3"
          type="button"
          @click="$emit('cancel')"
        >
          {{ cancel }}
        </ButtonLight>
        <ButtonBlue type="submit" :loading="loading">
          {{ submit }}
        </ButtonBlue>
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import FormInput from "./FormInput.vue";
import FormTextarea from "./FormTextarea.vue";
import FormSelect from "./FormSelect.vue";
import ButtonBlue from "./ButtonBlue.vue";
import ButtonLight from "./ButtonLight.vue";
import FormTipTap from "./FormTipTap.vue";
import { Field } from "@/types/form";
import { defineComponent, PropType } from "@vue/runtime-core";

export default defineComponent({
  components: {
    ButtonBlue,
    FormSelect,
    FormInput,
    ButtonLight,
    FormTextarea,
    FormTipTap,
  },
  props: {
    fields: {
      type: Array as PropType<Field[]>,
      required: true,
    },
    initial: {
      type: Object as PropType<{ [key: string]: string } | null>,
      default: () => null,
      required: false,
    },
    success: {
      type: String,
      required: false,
      default: "",
    },
    submit: {
      type: String,
      required: false,
      default: "Send" as string,
    },
    cancel: {
      type: String,
      required: false,
      default: "",
    },
    action: {
      type: String,
      required: true,
    },
  },
  emits: ["success", "error", "cancel"],
  data() {
    return {
      showSuccess: false,
      nonFieldErrors: [],
      errors: {} as { [key: string]: string[] },
      data: {} as { [key: string]: string | number | boolean },
      loading: false,
    };
  },
  watch: {
    initial: function () {
      this.data = Object.assign({}, this.initial, this.data);
    },
  },
  mounted() {
    this.data = Object.assign({}, this.initial);
  },
  methods: {
    handleSubmit() {
      this.showSuccess = false;
      this.loading = true;

      const data = {
        ...this.data,
        form: this.$refs.form,
      };

      this.$store
        .dispatch(this.action, data)
        .then((data) => {
          this.errors = {};
          this.nonFieldErrors = [];
          if (this.initial === null) this.data = {};
          this.showSuccess = true;
          this.loading = false;
          this.$emit("success", data);
        })
        .catch((errors) => {
          this.errors = errors;
          this.nonFieldErrors = errors.non_field_errors;
          this.loading = false;
          this.$emit("error", errors);
        });
    },
  },
});
</script>
