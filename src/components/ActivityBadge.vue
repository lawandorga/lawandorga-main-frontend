<script lang="ts" setup>
import type { ActivityState } from "@/features/admin/api/useProfiles";

defineProps<{ state: ActivityState }>();

const config: Record<ActivityState, { label: string; classes: string }> = {
  green: { label: "Aktiv (3 Mo.)", classes: "bg-green-100 text-green-800" },
  yellow: { label: "Aktiv (6 Mo.)", classes: "bg-yellow-100 text-yellow-800" },
  orange: {
    label: "Eingeloggt (6 Mo.)",
    classes: "bg-orange-100 text-orange-800",
  },
  red: { label: "Inaktiv (12+ Mo.)", classes: "bg-red-100 text-red-800" },
};
</script>

<template>
  <span
    :class="[
      'inline-flex items-center px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap',
      config[state].classes,
    ]"
  >
    {{ config[state].label }}
  </span>
</template>
