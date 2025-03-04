<template>
  <button
    class="w-7 h-7 rounded-md p-1 mr-1.5 border-2 border-transparent"
    type="button"
    :class="{
      'text-white bg-gray-900 !border-transparent': active,
      'text-gray-900': !active,
    }"
    :title="title"
    tabindex="-1"
    @click.prevent="action"
  >
    <svg class="w-full h-full fill-current remix">
      <use :xlink:href="`${remixiconUrl}#ri-${icon}`" />
    </svg>
  </button>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import remixiconUrl from "remixicon/fonts/remixicon.symbol.svg";

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
