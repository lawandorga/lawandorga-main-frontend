<script lang="ts" setup>
import { useImprintPage } from "../api/useImprintPage";

const { article } = useImprintPage();
</script>

<template>
  <section
    class="mx-auto max-w-7xl border-b border-gray-100 bg-white px-8 py-4"
  >
    <router-link
      class="text-formcolor text-lg font-medium"
      :to="{ name: 'start' }"
    >
      &#x21b5; Back
    </router-link>
  </section>
  <section class="mx-auto max-w-7xl bg-white px-8 py-12">
    <article v-if="article" class="prose prose-lg mx-auto">
      <h1>Impressum</h1>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div v-html="article.content"></div>
    </article>
  </section>
</template>
