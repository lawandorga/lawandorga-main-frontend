<script lang="ts" setup>
import { useRoute } from "vue-router";

import { formatDate } from "@/utils/date";

import { useArticle } from "../api/useArticle";

const route = useRoute();
const { article } = useArticle(route.params.id as string);
</script>

<template>
  <section
    class="mx-auto max-w-7xl border-b border-gray-100 bg-white px-8 py-4"
  >
    <button class="text-formcolor text-lg font-medium" @click="$router.back()">
      &#x21b5; Back
    </button>
  </section>
  <section class="mx-auto max-w-7xl bg-white px-8 py-12">
    <article v-if="article" class="prose prose-lg mx-auto">
      <em>{{ formatDate(article.date) }}</em>
      <h1>{{ article.title }}</h1>
      <p class="lead">{{ article.description }}</p>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div v-html="article.content"></div>
      <small v-if="article.author_name" class="block pt-6 text-right">
        Author: {{ article.author_name }}
      </small>
    </article>
  </section>
</template>
