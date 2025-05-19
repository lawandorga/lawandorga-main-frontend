<script lang="ts" setup>
import { watch } from "vue";
import { useRoute } from "vue-router";

const props = defineProps<{
  close: () => void;
}>();

const route = useRoute();

watch(
  () => route.fullPath,
  () => props.close(),
);
</script>

<template>
  <div></div>
</template>
