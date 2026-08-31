<script setup lang="ts">
import { ButtonNormal, ModalFree } from "lorga-ui";

defineProps<{
  modelValue: boolean;
  title: string;
  question: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  select: [scope: "this" | "all"];
}>();

const choose = (scope: "this" | "all") => {
  emit("select", scope);
  emit("update:modelValue", false);
};
</script>

<template>
  <ModalFree
    :model-value="modelValue"
    :title="title"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <p class="text-sm text-gray-600">{{ question }}</p>
    <div class="mt-6 flex flex-wrap items-center justify-end gap-3">
      <ButtonNormal kind="link" @click="emit('update:modelValue', false)">
        Cancel
      </ButtonNormal>
      <ButtonNormal kind="primary" @click="choose('this')"
        >This event</ButtonNormal
      >
      <ButtonNormal kind="secondary" @click="choose('all')"
        >All events</ButtonNormal
      >
    </div>
  </ModalFree>
</template>
