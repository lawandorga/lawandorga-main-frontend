<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();
const error = route.query.error;
</script>

<template>
  <div>{{ error }}</div>
</template>
