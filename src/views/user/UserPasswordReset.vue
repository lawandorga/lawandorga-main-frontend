<template>
  <BoxLoader />
</template>

<script lang="ts" setup>
import BoxLoader from "@/components/BoxLoader.vue";

const url = `${import.meta.env.VITE_AUTH_URL}/auth/password_reset/`;
window.location.href = url;
</script>
