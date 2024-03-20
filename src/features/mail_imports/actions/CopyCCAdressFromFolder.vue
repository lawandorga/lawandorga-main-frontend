<template>
  <ButtonNormal
    kind="action"
    class="w-[150px] text-center"
    :disabled="addressCopied"
    @click="copyMailAddress"
  >
    {{ addressCopied ? "Copied" : "Copy email address" }}
  </ButtonNormal>
</template>

<script setup lang="ts">
import { ButtonNormal } from "lorga-ui";
import { ref, toRefs } from "vue";

// props
const props = defineProps<{
  address: string;
}>();
const { address } = toRefs(props);

const addressCopied = ref<boolean>(false);

const copyMailAddress = () => {
  navigator.clipboard.writeText(address.value ?? "");
  addressCopied.value = true;
};
</script>
