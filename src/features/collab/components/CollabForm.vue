<script setup lang="ts">
import FormTiptap from "@/components/FormTiptap.vue";
import { ref, toRefs, watch } from "vue";

const props = defineProps<{ text: string }>();
const { text } = toRefs(props);

const model = ref<string>();
watch(
  text,
  () => {
    model.value = text.value;
  },
  { immediate: true },
);
</script>

<template>
  <div>{{ model }}</div>
  <div>
    <FormTiptap v-model="model" room="1" />
  </div>
</template>
