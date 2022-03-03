<template>
  <label class="block">
    <FormLabel :required="required" :label="label" />
    <textarea
      :id="`textarea--${name}`"
      class="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-lorgablue focus:border-lorgablue sm:text-sm"
      :value="modelValue.toString()"
      :placeholder="placeholder"
      :name="name"
      :required="required"
      @input="update($event)"
    ></textarea>
    <FormHelptext :helptext="helptext" />
  </label>
</template>

<script lang="ts">
import FormLabel from "./FormLabel.vue";
import FormHelptext from "./FormHelptext.vue";
import { defineComponent } from "vue";

export default defineComponent({
  components: {
    FormLabel,
    FormHelptext,
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
      type: [String, Boolean, Number],
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
    placeholder: {
      required: false,
      default: "",
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
