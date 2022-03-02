<template>
  <div class="block relative">
    <div>
      <FormLabel required :label="label" />
    </div>
    <div class="flex space-x-2 items-center" :class="{ 'mt-1': !!label }">
      <label class="relative leading-3">
        <Switch
          :model-value="modelValue"
          :class="[
            modelValue ? 'bg-lorgablue' : 'bg-gray-200',
            'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lorgablue',
          ]"
          @update:model-value="$emit('update:modelValue', $event)"
        >
          <span class="sr-only">{{ label }}</span>
          <span
            aria-hidden="true"
            :class="[
              modelValue ? 'translate-x-5' : 'translate-x-0',
              'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200',
            ]"
          />
        </Switch>
      </label>
    </div>
    <FormHelptext :helptext="helptext" />
  </div>
</template>

<script lang="ts">
import FormLabel from "./FormLabel.vue";
import FormHelptext from "./FormHelptext.vue";
import { defineComponent } from "vue";
import { Switch } from "@headlessui/vue";

export default defineComponent({
  components: {
    Switch,
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
