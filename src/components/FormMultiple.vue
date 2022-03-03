<template>
  <label :for="name" class="block relative">
    <FormLabel :required="required" :label="label" />
    <div class="mt-2">
      <input
        v-model="search"
        placeholder="Search"
        type="search"
        class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-t-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:z-10 focus:relative focus-within:ring-1 focus-within:ring-lorgablue focus-within:border-lorgablue focus:ring-lorgablue focus:border-lorgablue sm:text-sm"
      />
      <div class="shadow-sm rounded-md w-full">
        <select
          :id="`form--${name}`"
          multiple
          :name="name"
          :value="modelValue"
          class="cursor-pointer focus:ring-1 appearance-none block w-full p-0 border border-gray-300 rounded-bl-md overflow-x-hidden focus:outline-none focus:border-lorgablue focus:ring-lorgablue sm:text-sm"
          @keydown.space.left.right.stop.prevent="update($event.target.value)"
        >
          <option
            v-for="option in optionsSorted"
            :key="option.name"
            class="px-3 py-2 focus:text-red-500 focus:bg-red-500"
            :class="{
              'bg-lorgablue text-blue-50': checkOptionSelected(option),
            }"
            :value="option.id"
            :selected="checkOptionSelected(option)"
            @click="update(option)"
          >
            {{ option.name ?? option }}
          </option>
        </select>
      </div>
    </div>
    <FormHelptext :form-helptext="helptext" />
  </label>

  <!-- <Listbox
    ref="listbox"
    as="div"
    :class="{ relative: open }"
    @keydown.tab="open = false"
  >
    <ListboxLabel class="block text-sm font-medium text-gray-700">
      Assigned to
    </ListboxLabel>
    <div class="mt-1 relative">
      <ListboxButton
        class="
          relative
          w-full
          bg-white
          border border-gray-300
          rounded-md
          shadow-sm
          pl-3
          pr-10
          py-2
          text-left
          cursor-default
          focus:outline-none
          focus:ring-1
          focus:ring-indigo-500
          focus:border-indigo-500
          sm:text-sm
        "
        @click="open = !open"
        @keydown.enter.down="open = true"
        @keydown.esc="open = false"
      >
        <span class="block truncate">
          {{
            options
              .filter((item) => modelValueStringArray.includes(item.id.toString()))
              .map((item) => item.name)
              .join(", ") || "---"
          }}
        </span>
        <span
          class="
            absolute
            inset-y-0
            right-0
            flex
            items-center
            pr-2
            pointer-events-none
          "
        >
          <SelectorIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
        </span>
      </ListboxButton>

      <transition
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <ListboxOptions
          v-show="open"
          static
          :unmount="false"
          class="
            absolute
            z-20
            mt-1
            w-full
            bg-white
            shadow-lg
            max-h-60
            rounded-md
            py-1
            text-base
            ring-1 ring-black ring-opacity-5
            overflow-auto
            focus:outline-none
            sm:text-sm
          "
          @keydown="
            click($event);
            update($event.target.value);
          "
          @keydown.esc="open = false"
        >
          <ListboxOption
            v-for="option in options"
            :key="option.name"
            v-slot="{ active }"
            as="template"
            @click="update(option.id.toString())"
          >
            <li
              :value="option.id"
              :test="option.id"
              :class="[
                active ? 'text-white bg-indigo-600' : 'text-gray-900',
                'cursor-default select-none relative py-2 pl-8 pr-4',
              ]"
            >
              <span
                :class="[
                  modelValueStringArray.includes(option.id.toString())
                    ? 'font-semibold'
                    : 'font-normal',
                  'block truncate',
                ]"
              >
                {{ option.name }}
              </span>

              <span
                v-if="modelValueStringArray.includes(option.id.toString())"
                :class="[
                  active ? 'text-white' : 'text-indigo-600',
                  'absolute inset-y-0 left-0 flex items-center pl-1.5',
                ]"
              >
                <CheckIcon class="h-5 w-5" aria-hidden="true" />
              </span>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
  <div
    v-if="open"
    class="w-full h-full fixed inset-0 bg-red-500/25 z-10"
    @click="open = false"
  ></div> -->
</template>

<script lang="ts">
import FormLabel from "./FormLabel.vue";
import FormHelptext from "./FormHelptext.vue";
import { defineComponent, PropType } from "vue";

type FormOption = { name?: string; value?: string; id: number } | string;

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
      default: () => [],
      type: Array as PropType<string[]>,
    },
    name: {
      required: false,
      type: String,
      default: "",
    },
    options: {
      required: true,
      type: Array as PropType<FormOption[]>,
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
      open: false,
      clickListener: null,
      search: "",
    };
  },
  computed: {
    modelValueStringArray(): string[] {
      return this.modelValue.map((item) => item.toString());
    },
    optionsSorted(): FormOption[] {
      return [...this.optionsFiltered].sort((o1, o2) => {
        const s1 = this.checkOptionSelected(o1);
        const s2 = this.checkOptionSelected(o2);
        return s1 === s2 ? 0 : s1 ? -1 : 1;
      });
    },
    optionsFiltered(): FormOption[] {
      if (this.search === "") return this.options;
      return [...this.options].filter((o) => {
        let value = "";
        if (typeof o === "string") value = o.toLowerCase();
        else if (o.name) value = o.name.toLowerCase();
        return value.includes(this.search.toLowerCase());
      });
    },
  },
  methods: {
    checkOptionSelected(option: FormOption): boolean {
      if (typeof option === "object" && "value" in option)
        return this.modelValueStringArray.includes(option.value as string);

      if (typeof option === "object" && "id" in option)
        return this.modelValueStringArray.includes(option.id.toString());

      if (typeof option === "string")
        return this.modelValueStringArray.includes(option);

      return false;
    },
    update(option: FormOption) {
      let value = "";

      if (typeof option === "string") value = option;
      else value = option.id.toString();

      if (value === "") return;

      let values = [...this.modelValue];
      const index = this.modelValueStringArray.indexOf(value);
      if (index === -1) values.push(value);
      else values.splice(index, 1);

      this.$emit("update:modelValue", values);
    },
  },
});
</script>

<style>
/* select[multiple]:focus option:checked {
  @apply bg-gradient-to-r from-gray-600 to-gray-600;
  color: black !important;
} */
</style>
