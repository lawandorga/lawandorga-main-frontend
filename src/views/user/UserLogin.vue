<template><div class="p-2 text-sm">One moment please...</div></template>

<script lang="ts" setup>
import { useUserStore } from "@/store/user";
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

// login
const login = () => {
  const path = route.query.next ? route.query.next : "/dashboard/";
  const next = window.location.origin + path;
  const url = `${import.meta.env.VITE_AUTH_URL}/login/?next=${next}`;
  window.location.href = url;
};

// login or go to statistics
if (userStore.isAuthenticated) next();
else {
  userStore
    .updateData()
    .then(() => {
      next();
    })
    .catch((error) => {
      if (error && error.response && error.response.status === 401) login();
    });
}
</script>
