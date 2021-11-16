<template>
  <div
    class="
      w-full
      bg-white
      shadow-lg
      rounded-lg
      pointer-events-auto
      ring-1 ring-black ring-opacity-5
      overflow-hidden
    "
  >
    <div class="p-4">
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <CheckCircleIcon
            v-if="alert.type === 'success'"
            class="h-6 w-6 text-green-400"
            aria-hidden="true"
          />
          <ExclamationIcon
            v-if="alert.type === 'error'"
            class="h-6 w-6 text-red-400"
            aria-hidden="true"
          />
        </div>
        <div class="ml-3 w-0 flex-1">
          <p class="text-sm font-medium text-gray-900">
            {{ alert.heading }}
          </p>
          <p class="mt-1 text-sm text-gray-500">
            {{ alert.message }}
          </p>
        </div>
        <div class="ml-4 flex-shrink-0 flex">
          <button
            class="
              bg-white
              p-0.5
              rounded-md
              inline-flex
              text-gray-400
              hover:text-gray-500
              focus:outline-none
              focus:ring-2
              focus:bg-gray-100
              focus:ring-gray-200
            "
            @click="$store.dispatch('alert/closeAlert', alert)"
          >
            <span class="sr-only">Close</span>
            <XIcon class="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { CheckCircleIcon, ExclamationIcon } from "@heroicons/vue/outline";
import { XIcon } from "@heroicons/vue/solid";

export default defineComponent({
  components: {
    CheckCircleIcon,
    XIcon,
    ExclamationIcon,
  },
  props: {
    alert: {
      type: Object,
      required: true,
    },
  },
});
</script>
