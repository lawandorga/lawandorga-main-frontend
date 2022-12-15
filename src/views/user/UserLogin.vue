<template><BoxLoader /></template>

<script lang="ts" setup>
import BoxLoader from "@/components/BoxLoader.vue";
import { useUserStore } from "@/store/user";
import { watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

// next
const next = () => {
  const url = route.query.next as string;
  if (url) router.push(url);
  else router.push({ name: "dashboard" });
};

// tried
const tried = "tried" in route.query;

// login
const login = () => {
  const next = route.query.next ? route.query.next : "/dashboard/";
  const current = window.location.origin + route.path;
  const query = `?next=${next}&tried`;
  const base = import.meta.env.VITE_AUTH_URL;
  const authNext = encodeURIComponent(`${current}${query}`);
  const url = `${base}/login/?next=${authNext}`;
  window.location.href = url;
};

// login or go to next
if (userStore.isAuthenticated) next();
else if (!tried) login();

// watch user login
watch(userStore, (newValue) => {
  if (newValue) next();
});
</script>
