<script lang="ts" setup>
import type { ActivityState } from "@/features/admin/api/useProfiles";

defineProps<{ state: ActivityState }>();

const config: Record<ActivityState, { label: string; classes: string }> = {
  green: { label: "Active (3 mo.)", classes: "bg-green-100 text-green-800" },
  yellow: { label: "Active (6 mo.)", classes: "bg-yellow-100 text-yellow-800" },
  orange: {
    label: "Logged in (12 mo.)",
    classes: "bg-orange-100 text-orange-800",
  },
  red: { label: "Inactive (12+ mo.)", classes: "bg-red-100 text-red-800" },
};
</script>

<template>
  <span
    :class="[
      'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium whitespace-nowrap',
      config[state].classes,
    ]"
  >
    {{ config[state].label }}
  </span>
</template>
