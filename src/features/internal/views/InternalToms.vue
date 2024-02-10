<template>
  <section
    class="px-8 py-4 mx-auto bg-white border-b border-gray-100 max-w-7xl"
  >
    <router-link
      class="text-lg font-medium text-formcolor"
      :to="{ name: 'start' }"
    >
      &#x21b5; Back
    </router-link>
  </section>
  <section class="px-8 py-12 mx-auto bg-white max-w-7xl">
    <article v-if="article" class="mx-auto prose prose-lg">
      <h1>TOMS</h1>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div v-html="article.content"></div>
    </article>
  </section>
</template>

<script lang="ts" setup>
import InternalService from "@/services/internal";
import { ImprintPage } from "@/types/internal";
import useGet from "@/composables/useGet";
import { ref } from "vue";

const article = ref<ImprintPage | null>(null);

useGet(InternalService.getTomsPage, article);
</script>
