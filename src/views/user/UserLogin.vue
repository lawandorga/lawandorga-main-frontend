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
  // where to go if authenticated
  const next = (route.query.next as string) || "/dashboard/";
  const nextEncoded = encodeURIComponent(next);

  // for example https://www.law-orga.de/user/login
  const current = window.location.origin + route.path;

  // redirect back to this url after authentication
  const redirect = `${current}?next=${nextEncoded}&tried`;
  const redirectEncoded = encodeURIComponent(redirect);

  // authenticate on the backend
  const base = import.meta.env.VITE_AUTH_URL;
  const url = `${base}/login/?next=${redirectEncoded}`;
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
