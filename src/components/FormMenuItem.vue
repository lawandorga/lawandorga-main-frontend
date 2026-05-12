<script lang="ts">
import remixiconUrl from "remixicon/fonts/remixicon.symbol.svg";
import { defineComponent, PropType } from "vue";

export default defineComponent({
  props: {
    icon: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    action: {
      type: Function as PropType<() => void>,
      required: true,
    },
    isActive: {
      type: Function as PropType<() => boolean>,
      default: null,
      required: false,
    },
  },
  data() {
    return {
      remixiconUrl,
    };
  },
  computed: {
    active() {
      if (this.isActive) return this.isActive();
      return false;
    },
  },
});
</script>

<template>
  <button
    class="mr-1.5 h-7 w-7 rounded-md border-2 border-transparent p-1"
    type="button"
    :class="{
      'border-transparent! bg-gray-900 text-white': active,
      'text-gray-900': !active,
    }"
    :title="title"
    tabindex="-1"
    @click.prevent="action"
  >
    <svg class="remix h-full w-full fill-current">
      <use :xlink:href="`${remixiconUrl}#ri-${icon}`" />
    </svg>
  </button>
</template>
