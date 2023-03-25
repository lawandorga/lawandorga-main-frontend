<template>
  <BoxLoader />
</template>

<script setup lang="ts">
import BoxLoader from "@/components/BoxLoader.vue";
import { useRoute, useRouter } from "vue-router";
import { recordsGetRecord } from "@/services/records";

// router
const router = useRouter();

// route
const route = useRoute();
const recordId = route.params.record as string;

// redirect to the new view
recordsGetRecord(recordId).then((r) => {
  router.push({
    name: "folders-detail",
    params: { uuid: r.folder_uuid, record: r.id },
    query: route.query,
  });
});
</script>
