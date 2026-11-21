<script setup lang="ts">
// "Read full article" below a news teaser. The title stays a link too; this
// explicit link helps users who do not expect the title to be clickable.
// The hidden title makes the link name unique for screen readers.
defineProps<{ id: number; title: string }>();
</script>

<template>
  <router-link
    :to="{ name: 'internal-article', params: { id } }"
    class="text-lo-petrol mt-3 inline-flex min-h-6 items-center text-base font-bold"
    data-testid="read-more"
  >
    <span lang="en">Read full article</span>
    <span class="sr-only">: {{ title }}</span>
  </router-link>
</template>
