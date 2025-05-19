<script setup lang="ts">
import { ButtonNormal } from "lorga-ui";
import { ref, toRefs } from "vue";

const props = defineProps<{
  address: string;
}>();
const { address } = toRefs(props);

const addressCopied = ref<boolean>(false);

const copyMailAddress = () => {
  navigator.clipboard.writeText(address.value ?? "");
  addressCopied.value = true;
  setTimeout(() => {
    addressCopied.value = false;
  }, 800);
};
</script>

<template>
  <ButtonNormal kind="secondary" @click="copyMailAddress">
    {{ addressCopied ? "Copied!" : "Copy email address" }}
  </ButtonNormal>
</template>
