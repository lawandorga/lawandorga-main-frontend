<template>
  <label :for="name" class="block relative">
    <div>
      <FormLabel :required="required" :label="label" />
    </div>
    <div class="flex mt-1 space-x-2 items-center">
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
          class="
            appearance-none
            block
            w-full
            px-3
            py-2
            border border-gray-300
            rounded-md
            shadow-sm
            placeholder-gray-400
            focus:outline-none focus:ring-lorgablue focus:border-lorgablue
            sm:text-sm
          "
          :class="{
            'opacity-50 bg-gray-100 pointer-events-none': disabled,
          }"
          @mouseenter="setMouseFocus(true)"
          @mouseleave="setMouseFocus(false)"
          @blur="setInputFocus(false)"
          @focus="setInputFocus(true)"
          @input="update($event)"
        />
        <div
          v-if="unit"
          class="
            absolute
            inset-y-0
            right-0
            pr-3
            flex
            items-center
            pointer-events-none
            transition
            transform
            duration-100
          "
          :class="{ '-translate-x-6': type === 'number' && focus }"
        >
          <span id="price-currency" class="text-gray-500 sm:text-sm">
            {{ unit }}
          </span>
        </div>
      </div>
    </div>
    <FormHelptext :helptext="helptext" />
  </label>
</template>

<script lang="ts">
import FormLabel from "./FormLabel.vue";
import FormHelptext from "./FormHelptext.vue";
import { defineComponent } from "@vue/runtime-core";

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
    unit: {
      required: false,
      default: "",
      type: String,
    },
    tooltip: {
      required: false,
      default: "",
      type: String,
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
  data() {
    return {
      inputFocus: false,
      mouseFocus: false,
    };
  },
  computed: {
    focus() {
      return this.inputFocus || this.mouseFocus;
    },
  },
  methods: {
    setInputFocus(val: boolean) {
      this.inputFocus = val;
    },
    setMouseFocus(val: boolean) {
      this.mouseFocus = val;
    },
    update($event: Event) {
      this.$emit(
        "update:modelValue",
        ($event.target as HTMLInputElement).value,
      );
    },
  },
});
</script>
