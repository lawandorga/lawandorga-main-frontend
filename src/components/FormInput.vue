<template>
  <label :for="`form--${name}`" class="relative block">
    <div>
      <FormLabel :required="required" :label="label" />
    </div>
    <div class="flex items-center space-x-2" :class="{ 'mt-1': !!label }">
      <div class="relative w-full">
        <input
          :id="`form--${name}`"
          :name="name"
          :type="type"
          :placeholder="placeholder"
          :value="modelValue"
          :step="step"
          :min="min"
          :required="required"
          :disabled="disabled"
          :autocomplete="autocomplete"
          class="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-1 focus-within:ring-1 focus-within:ring-lorgablue focus-within:border-lorgablue focus:ring-lorgablue focus:border-lorgablue sm:text-sm"
          :class="{
            'opacity-50 bg-gray-100 pointer-events-none': disabled,
          }"
          @input="update($event)"
        />
      </div>
    </div>
    <div
      v-if="
        type === 'datetime-local' && modelValue && !modelValue.includes('T')
      "
      class="mt-1 text-sm text-right text-gray-700"
    >
      Error: {{ modelValue }}
    </div>
    <FormHelptext :helptext="helptext" />
  </label>
</template>

<script lang="ts">
import FormLabel from "./FormLabel.vue";
import FormHelptext from "./FormHelptext.vue";
import { defineComponent } from "vue";

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
    type: {
      default: "text",
      type: String,
      required: false,
    },
    name: {
      required: false,
      type: String,
      default: "",
    },
    placeholder: {
      required: false,
      default: null,
      type: String,
    },
    step: {
      required: false,
      default: null,
      type: Number,
    },
    min: {
      required: false,
      default: null,
      type: Number,
    },
    required: {
      required: false,
      default: false,
      type: Boolean,
    },
    disabled: {
      required: false,
      default: false,
      type: Boolean,
    },
    autocomplete: {
      required: false,
      default: null,
      type: String,
    },
  },
  emits: ["update:modelValue"],
  methods: {
    update($event: Event) {
      this.$emit(
        "update:modelValue",
        ($event.target as HTMLInputElement).value,
      );
    },
  },
});
</script>
