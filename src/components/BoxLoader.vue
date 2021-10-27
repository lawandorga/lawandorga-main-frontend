<template>
  <div>
    <div v-if="show"><slot /></div>
    <div v-if="!show">
      <div class="flex items-center">
        <Loader class="mr-2" />
        <div class="text-lg font-medium text-gray-600">
          One moment please. Loading...
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from "@/components/Loader.vue";

export default {
  components: {
    Loader,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
