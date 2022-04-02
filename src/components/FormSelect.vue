<template>
  <label :for="name" class="relative block">
    <FormLabel :required="required" :label="label" />
    <div class="flex items-center mt-1 space-x-2">
      <select
        :id="`form--${name}`"
        v-model="model"
        :name="name"
        class="block w-full py-2 pl-3 pr-6 mt-1 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none cursor-pointer focus:outline-none focus:ring-lorgablue focus:border-lorgablue focus:ring-1 sm:text-sm"
      >
        <option
          v-for="option in internalOptions"
          :key="option.name || option"
          :value="option.id || option.value || option"
        >
          {{ option.name || option }}
        </option>
      </select>
    </div>
    <FormHelptext :form-helptext="helptext" />
  </label>
</template>

<script lang="ts">
import FormLabel from "./FormLabel.vue";
import FormHelptext from "./FormHelptext.vue";
import { defineComponent, PropType } from "vue";

export default defineComponent({
  components: {
    FormHelptext,
    FormLabel,
  },
  props: {
    label: {
      required: true,
      type: String,
    },
    helptext: {
      required: false,
      default: "",
      type: String,
    },
    modelValue: {
      required: false,
      default: "",
      type: [String, Number, Boolean],
    },
    name: {
      required: false,
      type: String,
      default: "",
    },
    options: {
      required: true,
      type: Array as PropType<
        (string | { name: string; value: string | boolean | null })[]
      >,
    },
    required: {
      required: false,
      default: false,
      type: Boolean,
    },
  },
  emits: ["update:modelValue"],
  computed: {
    internalOptions() {
      if (this.required) return this.options;
      return [
        { name: "------", value: null as string | boolean | null },
        ...this.options,
      ];
    },
    model: {
      get() {
        return this.modelValue;
      },
      set(newValue: string | boolean | null) {
        this.$emit("update:modelValue", newValue);
      },
    },
  },
});
</script>
