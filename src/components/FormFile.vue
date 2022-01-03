<template>
  <label :for="name" class="block relative">
    <div>
      <FormLabel :required="required" :label="label" />
    </div>
    <div class="flex space-x-2 items-center" :class="{ 'mt-1': label }">
      <div class="relative w-full">
        <input
          :id="`form--${name}`"
          :name="name"
          type="file"
          :required="required"
          :disabled="disabled"
          class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus-within:ring-1 focus-within:ring-lorgablue focus-within:border-lorgablue focus:ring-lorgablue focus:border-lorgablue sm:text-sm"
          :class="{
            'opacity-50 bg-gray-100 pointer-events-none': disabled,
          }"
          @input="update($event)"
        />
        <div
          v-if="modelValue"
          class="absolute inset-0 left-auto flex items-center justify-center mr-4"
        >
          <button
            class="font-medium hover:text-opacity-75 text-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lorgablue focus:ring-opacity-70"
            @click.prevent="$emit('download')"
          >
            {{ modelValue }}
          </button>
        </div>
      </div>
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
    name: {
      required: false,
      type: String,
      default: "",
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
  },
  emits: ["update:modelValue", "download"],
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
