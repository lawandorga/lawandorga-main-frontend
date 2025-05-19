<script setup lang="ts">
import BoxLoader from "@/components/BoxLoader.vue";
import { useRoute, useRouter } from "vue-router";
import useClient from "@/api/client";

// router
const router = useRouter();

// route
const route = useRoute();
const recordId = route.params.record as string;

// redirect to the new view
const client = useClient();
const request = client.get(`api/records/query/${recordId}/`);
request().then((r) => {
  router.push({
    name: "folders-detail",
    params: { uuid: r.folder_uuid, record: r.id },
    query: route.query,
  });
});
</script>

<template>
  <BoxLoader />
</template>
