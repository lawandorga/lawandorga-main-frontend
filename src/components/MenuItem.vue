<template>
  <button
    class="menu-item"
    :class="{ 'is-active': isActive ? isActive() : null }"
    :title="title"
    @click="action"
  >
    <svg class="remix">
      <use :xlink:href="`${remixiconUrl}#ri-${icon}`" />
    </svg>
  </button>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
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
      type: Function,
      required: true,
    },

    isActive: {
      type: Function,
      default: null,
    },
  },

  data() {
    return {
      remixiconUrl,
    };
  },
});
</script>

<style>
.menu-item {
  width: 1.75rem;
  height: 1.75rem;
  color: #0d0d0d;
  border: none;
  background-color: transparent;
  border-radius: 0.4rem;
  padding: 0.25rem;
  margin-right: 0.25rem;
}
.menu-item svg {
  width: 100%;
  height: 100%;
  fill: currentColor;
}

.menu-item.is-active,
.menu-item:hover {
  color: #fff;
  background-color: #0d0d0d;
}
</style>
