<template>
  <label class="block">
    <FormLabel :required="required" :label="label" />
    <!-- <div class="relative pt-1 pb-3 px-2 border border-transparent">
      <div
        class="whitespace-pre-line text-base sm:text-sm"
        v-html="resizeValue"
      ></div>
      <textarea
        class="mt-1 appearance-none blockbg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-800 focus:border-blue-800 px-2 pt-1 pb-3 absolute w-full inset-0 overflow-y-hidden resize-none sm:text-sm"
        :value="modelValue"
        @input="update($event.target.value)"
      />
    </div> -->
    <textarea
      :id="`textarea--${name}`"
      class="
        mt-1
        appearance-none
        block
        w-full
        px-3
        py-2
        border border-gray-300
        rounded-md
        shadow-sm
        placeholder-gray-400
        focus:outline-none focus:ring-blue-800 focus:border-blue-800
        sm:text-sm
      "
      :value="modelValue"
      :placeholder="placeholder"
      :name="name"
      :required="required"
      @input="$emit('update:modelValue', $event.target.value)"
    ></textarea>
    <FormHelptext :form-helptext="FormHelptext" />
  </label>
</template>

<script lang="ts">
import FormLabel from "./FormLabel.vue";
import FormHelptext from "./FormHelptext.vue";

export default {
  components: {
    FormLabel,
    FormHelptext,
  },
  props: {
    label: {
      required: true,
      type: String,
    },
    FormHelptext: {
      required: false,
      default: "",
      type: String,
    },
    modelValue: {
      required: false,
      default: "",
      type: String,
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
  // data() {
  //   return {
  //     resizeValue: "",
  //   };
  // },
  // watch: {
  //   modelValue(newValue) {
  //     this.resizeValue = newValue;
  //   },
  // },
  // methods: {
  //   linebreaks(value) {
  //     value = value.replace(/(?:\r\n|\r|\n)/g, "<br/>");
  //     value += "<br/>";
  //     return value;
  //   },
  //   update(value) {
  //     this.$emit("update:modelValue", value);
  //     this.resizeValue = `${value}<br/>`;
  //   },
  // },
};
</script>
