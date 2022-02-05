<template>
  <TransitionRoot appear :show="modelValue" as="div">
    <Dialog as="div" @close="$emit('update:modelValue', false)">
      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="min-h-screen px-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <DialogOverlay class="fixed inset-0 bg-gray-800 bg-opacity-40" />
          </TransitionChild>

          <span class="inline-block h-screen align-middle" aria-hidden="true">
            &#8203;
          </span>

          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <div
              class="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-md"
            >
              <div class="block absolute top-0 right-0 pt-3 pr-3">
                <button
                  type="button"
                  class="bg-white p-0.5 border-2 border-transparent rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 hover:border-gray-100 focus:outline-none focus:ring-0"
                  @click="$emit('update:modelValue', false)"
                >
                  <span class="sr-only">Close</span>
                  <XIcon class="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <DialogTitle
                as="h3"
                class="text-lg font-medium leading-6 text-gray-900"
              >
                {{ title }}
              </DialogTitle>
              <div class="mt-2">
                <p class="text-sm text-gray-500 break-words">
                  Are you sure you want to {{ verb }}
                  {{ object ? object.name || object.id : "this object" }}?
                </p>
              </div>

              <div class="mt-4 flex space-x-3 justify-end">
                <ButtonBlue
                  color="indigo"
                  type="button"
                  @click="$emit('update:modelValue', false)"
                >
                  Cancel
                </ButtonBlue>
                <ButtonBlue
                  type="button"
                  :loading="loading"
                  @click="deleteClicked()"
                >
                  Yes, {{ verb }}
                </ButtonBlue>
              </div>
            </div>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogOverlay,
  DialogTitle,
} from "@headlessui/vue";
import ButtonBlue from "@/components/ButtonNormal.vue";
import { JsonModel, RequestFunction } from "@/types/shared";
import { XIcon } from "@heroicons/vue/outline";

export default defineComponent({
  components: {
    ButtonBlue,
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogOverlay,
    DialogTitle,
    XIcon,
  },
  props: {
    title: {
      type: String,
      required: false,
      default: "Delete",
    },
    object: {
      type: Object as PropType<JsonModel>,
      required: false,
      default: () => null,
    },
    modelValue: {
      type: Boolean,
      required: false,
      default: false,
    },
    request: {
      type: Function as PropType<RequestFunction>,
      required: false,
      default: null,
    },
    verb: {
      type: String,
      default: "delete",
    },
  },
  emits: ["update:modelValue", "deleted"],
  data: function () {
    return {
      loading: false,
    };
  },
  methods: {
    deleteClicked() {
      this.loading = true;
      this.request(this.object)
        .then(() => this.$emit("deleted", this.object))
        .finally(() => (this.loading = false));
    },
  },
});
</script>
