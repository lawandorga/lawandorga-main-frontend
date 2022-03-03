<template>
  <label :for="name" class="block relative">
    <FormLabel :required="required" :label="label" />
    <div class="flex mt-2 space-x-2 items-center">
      <div class="flex flex-col space-y-2 w-full items-start">
        <div
          v-for="key in Object.keys(value)"
          :key="key"
          class="flex space-x-3 w-full items-center"
        >
          <input
            v-model="value[key]"
            type="text"
            class="flex-grow appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-lorgablue focus:border-lorgablue focus:ring-1 sm:text-sm"
            @change="change()"
          />
          <button
            type="button"
            class="rounded-md p-1 hover:bg-gray-100 flex-shrink-0 border-gray-300 border focus:outline-none focus:ring-1 focus:ring-lorgablue focus:border-lorgablue"
            @click="remove(key)"
          >
            <XIcon class="w-6 h-6" />
          </button>
        </div>
        <button
          type="button"
          class="rounded-md p-1 hover:bg-gray-100 flex-shrink-0 border-gray-300 border focus:outline-none focus:ring-1 focus:ring-lorgablue focus:border-lorgablue"
          @click="add()"
        >
          <PlusIcon class="w-6 h-6" />
        </button>
      </div>
    </div>
    <FormHelptext :form-helptext="helptext" />
  </label>
</template>

<script lang="ts">
import FormLabel from "./FormLabel.vue";
import FormHelptext from "./FormHelptext.vue";
import { defineComponent, PropType } from "vue";
import { XIcon, PlusIcon } from "@heroicons/vue/outline";

export default defineComponent({
  components: {
    FormHelptext,
    XIcon,
    FormLabel,
    PlusIcon,
  },
  props: {
    label: {
      required: true,
      type: String,
    },
    name: {
      required: true,
      type: String,
    },
    modelValue: {
      required: false,
      default: () => [],
      type: Array as PropType<string[]>,
    },
    required: {
      required: false,
      default: false,
      type: Boolean,
    },
    helptext: {
      required: false,
      default: "",
      type: String,
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      value: {} as { [key: number]: string },
    };
  },
  watch: {
    modelValue(newValue) {
      this.value = {};
      newValue.forEach((element: string, index: number) => {
        this.value[index] = element;
      });
    },
  },
  methods: {
    add() {
      const key =
        Math.max(...Object.keys(this.value).map((x) => parseInt(x)), 0) + 1;
      this.value[key] = "";
      this.change();
    },
    remove(key: number) {
      delete this.value[key];
      this.change();
    },
    change() {
      this.$emit("update:modelValue", Object.values(this.value));
    },
  },
});
</script>
