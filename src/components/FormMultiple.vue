<template>
  <div class="space-y-1">
    <Combobox v-slot="{ open }" v-model="model">
      <ComboboxLabel>
        <FormLabel :label="label" required />
      </ComboboxLabel>

      <div class="relative">
        <div class="inline-block w-full rounded-md shadow-sm">
          <div
            class="relative w-full py-2 pl-2 pr-10 text-left transition duration-150 ease-in-out bg-white border border-gray-300 cursor-default group focus-within:border-blue-700 focus-within:outline-none focus-within:ring-1 focus-within:ring-blue-700 sm:text-sm sm:leading-5"
            :class="[open ? 'rounded-t-md' : 'rounded-md']"
            @click="focusInput()"
          >
            <div class="flex flex-wrap gap-2">
              <span
                v-for="option in model"
                :key="option"
                class="flex items-center pl-2 pr-0.5 text-blue-700 border border-blue-100 rounded bg-blue-50"
              >
                <span class="py-0.5 mr-0.5">
                  {{ formOptions.find((o) => o.value === option)?.name }}
                </span>
                <button
                  tabindex="-1"
                  class="p-1 text-blue-300 rounded hover:text-blue-700 focus:outline-none focus:ring-0"
                  @click="update(option)"
                >
                  <XIcon class="w-4 h-4" />
                </button>
              </span>
              <ComboboxInput
                ref="input"
                class="grow focus:ring-0 focus:outline-none"
                placeholder="Search..."
                @change="search = $event.target.value"
              />
            </div>
            <ComboboxButton
              class="absolute inset-y-0 right-0 flex items-center pr-2"
            >
              <svg
                class="w-5 h-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </ComboboxButton>
          </div>
        </div>

        <div
          class="absolute z-10 w-full bg-white border-2 border-none rounded-b-md"
        >
          <ComboboxOptions
            class="overflow-auto text-base leading-6 border border-blue-700 shadow-lg rounded-b-md ring-1 ring-blue-700 max-h-60 focus:outline-none sm:text-sm sm:leading-5"
          >
            <ComboboxOption
              v-for="option in optionsFiltered"
              :key="option.value"
              v-slot="{ active }"
              :value="option.value"
              as="template"
            >
              <li
                class="relative py-2 pl-3 cursor-pointer select-none pr-9 focus:outline-none"
                :class="[
                  active ? 'bg-blue-100 text-blue-900' : 'text-gray-600',
                  model.includes(option.value)
                    ? 'font-semibold bg-blue-50'
                    : '',
                ]"
              >
                <span class="block truncate">
                  {{ option.name }}
                </span>
                <span
                  v-if="model.includes(option.value)"
                  class="absolute inset-y-0 right-0 flex items-center pr-4"
                  :class="{
                    'text-blue-900': active,
                    'text-gray-600': !active,
                  }"
                >
                  <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </li>
            </ComboboxOption>
            <ComboboxOption
              v-if="optionsFiltered.length === 0"
              as="template"
              disabled
            >
              <li
                class="relative py-2 pl-3 text-gray-500 select-none pr-9 focus:outline-none"
              >
                Nothing found.
              </li>
            </ComboboxOption>
          </ComboboxOptions>
        </div>
      </div>
    </Combobox>
    <FormHelptext :helptext="helptext" />
  </div>
</template>

<script lang="ts">
import FormLabel from "./FormLabel.vue";
import FormHelptext from "./FormHelptext.vue";
import { defineComponent, PropType } from "vue";
import {
  Combobox,
  ComboboxLabel,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
} from "@headlessui/vue";
import { XIcon } from "@heroicons/vue/solid";

type FormOption = { name: string; value: string };
type FormOptionInput =
  | { name?: string; value?: string | number; id?: number }
  | string;

export default defineComponent({
  components: {
    FormHelptext,
    FormLabel,
    Combobox,
    ComboboxLabel,
    ComboboxInput,
    ComboboxButton,
    ComboboxOptions,
    ComboboxOption,
    XIcon,
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
      default: () => [],
      type: Array as PropType<string[]>,
    },
    options: {
      required: true,
      type: Array as PropType<FormOptionInput[]>,
    },
    required: {
      required: false,
      default: false,
      type: Boolean,
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      search: "",
    };
  },
  computed: {
    model: {
      get() {
        return this.modelValue.map((v) => String(v));
      },
      set(value: string) {
        this.update(value);
      },
    },
    formOptions(): FormOption[] {
      return this.options.map((o: FormOptionInput) => {
        if (typeof o === "string")
          return {
            name: o,
            value: o,
          };
        else {
          let value = "-";
          if (o.value) value = String(o.value);
          else if (o.id) value = String(o.id);
          return {
            name: o.name || "-",
            value: value,
          };
        }
      });
    },
    optionsSorted(): FormOption[] {
      return [...this.optionsFiltered].sort((o1, o2) => {
        const s1 = this.checkOptionSelected(o1);
        const s2 = this.checkOptionSelected(o2);
        return s1 === s2 ? 0 : s1 ? -1 : 1;
      });
    },
    optionsFiltered(): FormOption[] {
      if (this.search === "") return this.formOptions;
      return this.formOptions.filter((o) => {
        return o.name.toLowerCase().includes(this.search.toLowerCase());
      });
    },
  },
  methods: {
    focusInput() {
      (this.$refs.input as InstanceType<typeof ComboboxInput>).$el.focus();
    },
    resetInput() {
      (this.$refs.input as InstanceType<typeof ComboboxInput>).$el.value = "";
    },
    checkOptionSelected(option: FormOption): boolean {
      return this.model.includes(option.value);
    },
    update(value: string) {
      let values = [...this.model];

      const index = this.model.indexOf(value);
      if (index === -1) values.push(value);
      else values.splice(index, 1);

      this.$emit("update:modelValue", values);
    },
  },
});
</script>
