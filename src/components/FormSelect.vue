<template>
  <label :for="name" class="block relative">
    <FormLabel :required="required" :label="label" />
    <div class="flex mt-1 space-x-2 items-center">
      <select
        :id="`form--${name}`"
        :name="name"
        :required="required"
        :value="modelValue"
        class="cursor-pointer mt-1 appearance-none block w-full pl-3 pr-6 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-lorgablue focus:border-lorgablue sm:text-sm"
        @input="update($event)"
      >
        <option
          v-for="option in options"
          :key="option.name"
          :value="option.id || option.value"
        >
          {{ option.name ?? option }}
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
      type: Array as PropType<{ name: string; value: string | boolean }[]>,
    },
    required: {
      required: false,
      default: false,
      type: Boolean,
    },
  },
  emits: ["update:modelValue"],
  methods: {
    typeCorrect(value: string | boolean) {
      if (value === "true") return true;
      else if (value === "false") return false;
      return value;
    },
    update($event: Event) {
      this.$emit(
        "update:modelValue",
        this.typeCorrect(($event.target as HTMLSelectElement).value),
      );
    },
  },
});
</script>
