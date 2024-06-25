<script setup lang="ts">
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { CogIcon } from "@heroicons/vue/24/outline";
</script>

<template>
  <BreadcrumbsBar
    class="lg:col-span-2"
    :base="{ name: 'admin-dashboard' }"
    :pages="[
      { name: 'Collab Templates', to: { name: 'admin-collab-templates' } },
      { name: 'Footer', to: { name: 'admin-collab-letterhead' } },
    ]"
  >
    <CogIcon class="w-6 h-6" />
  </BreadcrumbsBar>

  <div>HEADER</div>
</template>
