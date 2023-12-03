<script setup lang="ts">
import { ButtonNormal } from "lorga-ui";

const print = () => {
  window.print();
};
</script>

<template>
  <ButtonNormal kind="action" @click="print">Print</ButtonNormal>
</template>
